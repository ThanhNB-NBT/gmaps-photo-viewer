# Tải trang video Facebook hộ Worker (worker.js) — chạy trên máy có IP nhà mạng.
# Facebook trả trang KHÔNG có link video cho mọi IP Cloudflare, nhưng trả đủ cho IP dân dụng.
# Chỉ trả HTML (~1 MB) để Worker bóc link mp4; video vẫn do Worker kéo thẳng từ CDN, không đi qua đây.
# Chỉ nhận link Facebook + đúng khoá (header X-Key) nên không thành proxy mở.
# Chạy: FB_RELAY_KEY=<khoá> python3 fbrelay.py   (nghe 127.0.0.1:8787, mở ra ngoài qua Cloudflare Tunnel)
import hmac, os, re, urllib.parse, urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

KEY = os.environ['FB_RELAY_KEY']
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'
FB = re.compile(r'(^|\.)(facebook\.com|fb\.com|fb\.watch)$')


class H(BaseHTTPRequestHandler):
    def do_GET(self):
        if not hmac.compare_digest(self.headers.get('X-Key', ''), KEY):
            return self.send_error(403)
        link = (urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query).get('url') or [''])[0]
        u = urllib.parse.urlsplit(link)
        if u.scheme != 'https' or not FB.search(u.hostname or ''):
            return self.send_error(400, 'Chi nhan link Facebook')
        req = urllib.request.Request(link, headers={
            'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'en-US,en;q=0.9',
            'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Dest': 'document'})
        try:
            with urllib.request.urlopen(req, timeout=25) as r:
                body, final = r.read(8_000_000), r.url
        except Exception as e:
            return self.send_error(502, str(e)[:120])
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('X-Final-URL', final)  # link chia sẻ chuyển hướng về /reel/<id>: Worker cần id này
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', 8787), H).serve_forever()
