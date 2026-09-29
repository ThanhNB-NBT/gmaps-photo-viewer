// Cloudflare Worker: kéo video TikTok / Facebook hộ trang GMaps Photo Viewer — cho mạng chặn CDN
// (VPN công ty...) và vì Facebook không cho trang khác đọc video. Không lưu gì: video chảy thẳng qua.
// Chỉ nhận link TikTok/Facebook và chỉ tải đúng link video bóc ra được, nên không thành proxy mở.
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': 'Content-Disposition' };
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';
const fail = (msg, status) => new Response(msg, { status, headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' } });

// Lấy thẳng từ trang TikTok: JSON __UNIVERSAL_DATA_FOR_REHYDRATION__ có sẵn link video, nhưng CDN đòi đúng
// cookie (tt_chain_token) mà trang vừa đặt -> phải gửi kèm lúc tải. tikwm chỉ còn là dự phòng: bản free giới
// hạn 10.000 lượt/ngày theo IP, mà IP ra của Cloudflare dùng chung với cả thiên hạ nên hay hết lượt.
async function tiktokPage(link) {
  const r = await fetch(link, { headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'en-US,en;q=0.9' } });
  const m = (await r.text()).match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([^<]+)</);
  const it = m && JSON.parse(m[1]).__DEFAULT_SCOPE__['webapp.video-detail']?.itemInfo?.itemStruct;
  if (!it || !it.video) throw new Error('TikTok không trả dữ liệu video');
  if (it.imagePost) throw new Error('Bài này là ảnh (slideshow), không phải video');
  // Bản H.264 nét nhất. H.265 nhiều máy phát ra màn đen.
  const b = (it.video.bitrateInfo || []).filter(x => /h264/i.test(x.CodecType)).sort((x, y) => y.Bitrate - x.Bitrate)[0];
  const url = (b && b.PlayAddr.UrlList[0]) || it.video.playAddr;
  if (!url) throw new Error('TikTok không trả link video');
  const Cookie = r.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
  return { url, name: 'tiktok_' + ((it.author && it.author.uniqueId) || '') + '_' + it.id + '.mp4',
    headers: { Cookie, Referer: 'https://www.tiktok.com/' } };
}

async function tikwm(link) {
  // tikwm free giới hạn 1 lượt/giây theo IP -> gặp "Limit" thì đợi rồi thử lại, tối đa 3 lần.
  let j = null;
  for (let i = 0; i < 3; i++) {
    j = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(link))
      .then(r => r.json()).catch(() => null);
    if (!(j && j.code !== 0 && /limit/i.test(j.msg || '') && !/day/i.test(j.msg))) break;
    await new Promise(r => setTimeout(r, 1100));
  }
  if (!j || j.code !== 0) throw new Error((j && j.msg) || 'tikwm không trả lời');
  const d = j.data;
  if (d.images && d.images.length) throw new Error('Bài này là ảnh (slideshow), không phải video');
  // play = H.264, không logo. hdplay đa phần là H.265 -> nhiều máy phát ra màn đen.
  let u = d.play || d.hdplay;
  if (u.startsWith('/')) u = 'https://www.tikwm.com' + u;
  return { url: u, name: 'tiktok_' + ((d.author && d.author.unique_id) || '') + '_' + d.id + '.mp4' };
}

async function tiktok(link) {
  try { return await tiktokPage(link); }
  catch (e) { return tikwm(link).catch(e2 => { throw new Error(e.message + ' (dự phòng tikwm: ' + e2.message + ')'); }); }
}

// Trang video/reel FB công khai, tải KHÔNG đăng nhập với UA trình duyệt, có "browser_native_hd_url"
// (mp4 liền tiếng). Trang reel nạp sẵn cả loạt reel kế tiếp: "id" ĐẦU TIÊN sau mỗi link là id của
// chính video đó — cùng cách chọn với bookmarklet trong index.html, đã đối chiếu trên reel thật.
const fbId = href => (href.match(/(?:videos\/(?:[^/?]+\/)?|reel\/|[?&]v=)(\d+)/) || [])[1];
// HD của reel thường là AV1 (av1_compressed_source) hoặc VP9 (compressed_source) — máy thiếu codec
// phát ra màn đen. Chỉ bản có "h264" trong vencode_tag và SD (sve_sd) là H.264 -> mặc định chỉ lấy HD khi
// nó là H.264, không thì lấy SD. hd=true: lấy HD bất kể codec (nét hơn, nhưng cần codec AV1/VP9).
const vtag = u => { try { return JSON.parse(atob(new URL(u).searchParams.get('efg'))).vencode_tag || ''; } catch (e) { return ''; } };
function fbPick(h, id, hd) {
  const J = s => JSON.parse('"' + s + '"');
  const all = [...h.matchAll(/"browser_native_(hd|sd)_url":"([^"]+)"/g)]
    .map(m => ({ q: m[1], u: J(m[2]), id: (h.slice(m.index).match(/"id":"(\d+)"/) || [])[1] }));
  let mine = all.filter(x => x.id === id);
  if (!mine.length && all.length) mine = all.filter(x => x.id === all[0].id);  // không khớp id -> video đầu trang
  const H = mine.find(x => x.q === 'hd'), S = mine.find(x => x.q === 'sd');
  if (H && (hd || /h264/i.test(vtag(H.u)))) return { url: H.u, q: 'hd' };
  if (S || H) return { url: (S || H).u, q: S ? 'sd' : 'hd' };
  for (const k of ['playable_url_quality_hd', 'playable_url']) {
    const m = h.match(new RegExp('"' + k + '":"([^"]+)"'));
    if (m) return { url: J(m[1]), q: 'hd' };
  }
}

// Facebook trả trang KHÔNG có link video cho mọi IP Cloudflare (09/2026: thử reel, /videos/, m., mbasic.,
// trang nhúng, UA crawler — đều rỗng), nhưng trả đủ cho IP nhà mạng. Nên chỉ khâu tải trang HTML đi vòng
// qua fbrelay.py chạy trên máy nhà (Cloudflare Tunnel; khoá FB_RELAY_KEY là secret của Worker). Video mp4
// vẫn kéo thẳng từ CDN của FB như trước.
const FB_RELAY = 'https://fbx.120203.xyz';
async function facebook(link, hd, env) {
  const r = await fetch(FB_RELAY + '/?url=' + encodeURIComponent(link), { headers: { 'X-Key': env.FB_RELAY_KEY || '' } });
  if (!r.ok) throw new Error('Máy chuyển tiếp Facebook trả ' + r.status + ' — máy nhà tắt hoặc mất mạng? '
    + 'Tạm dùng nút "⬇ Tải video FB" trên thanh dấu trang.');
  // Link chia sẻ (/share/v/..., fb.watch) tự chuyển hướng về /reel/<id> hoặc /watch?v=<id>: lấy id từ URL cuối.
  const id = fbId(r.headers.get('X-Final-URL') || link) || fbId(link);
  const v = fbPick(await r.text(), id, hd);
  if (!v) throw new Error('Không thấy video — video riêng tư/giới hạn người xem, hoặc Facebook đòi đăng nhập. '
    + 'Thử nút "⬇ Tải video FB" trên thanh dấu trang (mục Facebook trong trang GMaps Photo Viewer).');
  return { url: v.url, name: 'facebook_' + (id || Date.now()) + '_' + v.q + '.mp4' };
}

// Video người dùng đăng lên Google Maps: id lh3 + "=dv" -> lh3 chuyển (302) sang mp4 GỐC trên
// drum.usercontent.google.com. Id của ảnh thì =dv trả 500 -> hỏi trước bằng redirect:'manual' để báo lỗi rõ.
// Đi qua Worker (thay vì trình duyệt tải thẳng) chỉ để đặt được tên file: a[download] bị bỏ qua khi khác origin.
async function gmaps(link) {
  const b = link.split('=')[0];
  const r = await fetch(b + '=dv', { redirect: 'manual' });
  if (r.status < 300 || r.status > 399) throw new Error('Link này là ảnh, không phải video (Google trả ' + r.status + ')');
  return { url: b + '=dv', name: 'gmaps_' + b.slice(-12) + '.mp4' };
}

// Tên file người dùng tự điền: bỏ ký tự Windows cấm, thêm .mp4 nếu thiếu. Rỗng -> tên mặc định.
function fileName(s, def) {
  s = (s || '').replace(/[\x00-\x1f\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').replace(/^[.\s]+|[.\s]+$/g, '').slice(0, 150);
  return !s ? def : /\.mp4$/i.test(s) ? s : s + '.mp4';
}
// Tên có dấu (tiếng Việt) phải đi qua filename* (RFC 5987); filename="" chỉ để lại bản ASCII cho máy cũ.
const disposition = n => `attachment; filename="${n.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''`
  + encodeURIComponent(n).replace(/['()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());

export { fbPick, fileName, disposition };  // cho self-check chạy bằng Node

export default {
  async fetch(req, env) {
    const link = new URL(req.url).searchParams.get('url') || '';
    let host = '';
    try { host = new URL(link).hostname; } catch (e) {}
    const get = /(^|\.)tiktok\.com$/.test(host) ? tiktok
              : /(^|\.)(facebook\.com|fb\.com|fb\.watch)$/.test(host) ? facebook
              : /^lh\d\.googleusercontent\.com$/.test(host) ? gmaps : null;
    if (!get) return fail('Chỉ nhận link TikTok, Facebook hoặc video Google Maps (lh3)', 400);

    const q = new URL(req.url).searchParams;
    let v;
    try { v = await get(link, q.get('q') === 'hd', env); } catch (e) { return fail(e.message, 502); }
    const r = await fetch(v.url, { headers: { 'User-Agent': UA, ...v.headers } });
    if (!r.ok) return fail('Máy chủ video trả ' + r.status, 502);
    const h = { ...CORS, 'Content-Type': 'video/mp4', 'Content-Disposition': disposition(fileName(q.get('name'), v.name)) };
    if (r.headers.get('Content-Length')) h['Content-Length'] = r.headers.get('Content-Length');
    return new Response(r.body, { headers: h });
  },
};
