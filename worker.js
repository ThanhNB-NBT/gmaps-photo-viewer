// Cloudflare Worker: kéo video TikTok hộ trang GMaps Photo Viewer, cho mạng chặn CDN TikTok
// (VPN công ty...). Không lưu gì — video chảy thẳng từ TikTok qua đây tới trình duyệt.
// Chỉ nhận link TikTok và chỉ tải đúng link video tikwm trả về, nên không thành proxy mở cho mọi trang.
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': 'Content-Disposition' };
const fail = (msg, status) => new Response(msg, { status, headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' } });

export default {
  async fetch(req) {
    const link = new URL(req.url).searchParams.get('url') || '';
    let host = '';
    try { host = new URL(link).hostname; } catch (e) {}
    if (!/(^|\.)tiktok\.com$/.test(host)) return fail('Chỉ nhận link TikTok', 400);

    // tikwm free giới hạn 1 lượt/giây theo IP -> gặp "Limit" thì đợi rồi thử lại, tối đa 3 lần.
    let j = null;
    for (let i = 0; i < 3; i++) {
      j = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(link))
        .then(r => r.json()).catch(() => null);
      if (!(j && j.code !== 0 && /limit/i.test(j.msg || ''))) break;
      await new Promise(r => setTimeout(r, 1100));
    }
    if (!j || j.code !== 0) return fail((j && j.msg) || 'tikwm không trả lời', 502);
    const d = j.data;
    if (d.images && d.images.length) return fail('Bài này là ảnh (slideshow), không phải video', 422);

    // play = H.264, không logo. hdplay đa phần là H.265 -> nhiều máy phát ra màn đen.
    let u = d.play || d.hdplay;
    if (u.startsWith('/')) u = 'https://www.tikwm.com' + u;
    const v = await fetch(u);
    if (!v.ok) return fail('CDN TikTok trả ' + v.status, 502);

    const name = 'tiktok_' + ((d.author && d.author.unique_id) || '') + '_' + d.id + '.mp4';
    const h = { ...CORS, 'Content-Type': 'video/mp4', 'Content-Disposition': `attachment; filename="${name}"` };
    if (v.headers.get('Content-Length')) h['Content-Length'] = v.headers.get('Content-Length');
    return new Response(v.body, { headers: h });
  },
};
