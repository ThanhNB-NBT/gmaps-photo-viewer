// Cloudflare Worker: kéo video TikTok / Facebook hộ trang GMaps Photo Viewer — cho mạng chặn CDN
// (VPN công ty...) và vì Facebook không cho trang khác đọc video. Không lưu gì: video chảy thẳng qua.
// Chỉ nhận link TikTok/Facebook và chỉ tải đúng link video bóc ra được, nên không thành proxy mở.
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': 'Content-Disposition' };
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';
const fail = (msg, status) => new Response(msg, { status, headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' } });

async function tiktok(link) {
  // tikwm free giới hạn 1 lượt/giây theo IP -> gặp "Limit" thì đợi rồi thử lại, tối đa 3 lần.
  let j = null;
  for (let i = 0; i < 3; i++) {
    j = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(link))
      .then(r => r.json()).catch(() => null);
    if (!(j && j.code !== 0 && /limit/i.test(j.msg || ''))) break;
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

// Trang video/reel FB công khai, tải KHÔNG đăng nhập với UA trình duyệt, vẫn có "browser_native_hd_url"
// (mp4 liền tiếng, H.264). Trang reel nạp sẵn cả loạt reel kế tiếp: "id" ĐẦU TIÊN sau mỗi link là id của
// chính video đó — cùng cách chọn với bookmarklet trong index.html, đã đối chiếu trên reel thật.
const fbId = href => (href.match(/(?:videos\/(?:[^/?]+\/)?|reel\/|[?&]v=)(\d+)/) || [])[1];
function fbPick(h, id) {
  const J = s => JSON.parse('"' + s + '"');
  const hit = id && [...h.matchAll(/"browser_native_hd_url":"([^"]+)"/g)]
    .find(m => (h.slice(m.index).match(/"id":"(\d+)"/) || [])[1] === id);
  if (hit) return J(hit[1]);
  for (const k of ['browser_native_hd_url', 'browser_native_sd_url', 'playable_url_quality_hd', 'playable_url']) {
    const m = h.match(new RegExp('"' + k + '":"([^"]+)"'));
    if (m) return J(m[1]);
  }
}
async function facebook(link) {
  // Link chia sẻ (/share/v/..., fb.watch) tự chuyển hướng về /reel/<id> hoặc /watch?v=<id>: lấy id từ URL cuối.
  const r = await fetch(link, { headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Dest': 'document' } });
  const id = fbId(r.url || link) || fbId(link);
  const u = fbPick(await r.text(), id);
  if (!u) throw new Error('Không thấy video — video riêng tư/giới hạn người xem, hoặc Facebook đòi đăng nhập. '
    + 'Thử nút "⬇ Tải video FB" trên thanh dấu trang (mục Dự phòng trong trang GMaps Photo Viewer).');
  return { url: u, name: 'facebook_' + (id || Date.now()) + '.mp4' };
}

export default {
  async fetch(req) {
    const link = new URL(req.url).searchParams.get('url') || '';
    let host = '';
    try { host = new URL(link).hostname; } catch (e) {}
    const get = /(^|\.)tiktok\.com$/.test(host) ? tiktok
              : /(^|\.)(facebook\.com|fb\.com|fb\.watch)$/.test(host) ? facebook : null;
    if (!get) return fail('Chỉ nhận link TikTok hoặc Facebook', 400);

    let v;
    try { v = await get(link); } catch (e) { return fail(e.message, 502); }
    const r = await fetch(v.url, { headers: { 'User-Agent': UA } });
    if (!r.ok) return fail('Máy chủ video trả ' + r.status, 502);
    const h = { ...CORS, 'Content-Type': 'video/mp4', 'Content-Disposition': `attachment; filename="${v.name}"` };
    if (r.headers.get('Content-Length')) h['Content-Length'] = r.headers.get('Content-Length');
    return new Response(r.body, { headers: h });
  },
};
