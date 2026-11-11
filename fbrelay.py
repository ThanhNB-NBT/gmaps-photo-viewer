# Tải trang video Facebook hộ Worker (worker.js) — chạy trên máy có IP nhà mạng.
# Facebook trả trang KHÔNG có link video cho mọi IP Cloudflare, nhưng trả đủ cho IP dân dụng.
# Chỉ trả HTML (~1 MB) để Worker bóc link mp4; video vẫn do Worker kéo thẳng từ CDN, không đi qua đây.
# Chỉ nhận link Facebook + đúng khoá (header X-Key) nên không thành proxy mở.
# /yt?id=<id 11 ký tự>: tải video YouTube bằng yt-dlp ngay trên máy này — YouTube chặn IP Cloudflare, và link
# googlevideo khoá theo IP máy lấy link nên Worker không tự kéo được -> video chảy qua đây.
# /ig?url=<link Instagram>: cùng đường ống yt-dlp cho reel / bài video Instagram công khai.
# Cần yt-dlp, deno (yt-dlp giải chữ ký YouTube), ffmpeg trong bin/ cạnh file này (bản chạy độc lập, không sudo).
# Chạy: FB_RELAY_KEY=<khoá> python3 fbrelay.py   (nghe 127.0.0.1:8787, mở ra ngoài qua Cloudflare Tunnel)
import hmac, json, os, re, shutil, subprocess, tempfile, urllib.parse, urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

KEY = os.environ['FB_RELAY_KEY']
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'
FB = re.compile(r'(^|\.)(facebook\.com|fb\.com|fb\.watch)$')
IG = re.compile(r'(^|\.)(instagram\.com|instagr\.am)$')
BIN = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bin')
ENV = {**os.environ, 'PATH': BIN + os.pathsep + os.environ.get('PATH', '')}
# H.264 + AAC (m4a), nét nhất tới 1080p (res = cạnh ngắn, nên Short dọc 1080x1920 vẫn lấy đủ). Trên 1080p
# YouTube chỉ có VP9/AV1 — nhiều máy phát ra màn đen, nên không lấy.
YTDLP = [BIN + '/yt-dlp', '--no-playlist', '--no-warnings', '-f', 'bv*+ba/b', '-S', 'vcodec:h264,res:1080,acodec:m4a']


class H(BaseHTTPRequestHandler):
    def text(self, code, msg):
        b = msg.encode()
        self.send_response(code)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    # title=True: gửi tiêu đề video (X-Name) để Worker đặt tên file; Instagram không có tiêu đề ("Video by …").
    def ytdlp(self, url, title=True):
        # Bóc thông tin 1 lần (-j, lấy tiêu đề đặt tên file), lần tải đọc lại từ file json, khỏi hỏi YouTube 2 lần.
        j = subprocess.run(YTDLP + ['-j', url],
                           capture_output=True, text=True, env=ENV, timeout=120)
        # Lỗi trả 422 chứ không 502: Cloudflare thay thân trang 502 của máy gốc bằng "error code: 502".
        if j.returncode:
            return self.text(422, (j.stderr.strip().splitlines() or ['yt-dlp lỗi'])[-1][:300])
        # shortcut: bài Instagram nhiều video (carousel) ra mỗi video một dòng JSON -> chỉ lấy video đầu;
        # cần chọn video thứ N thì thêm --playlist-items theo ?img_index= của link.
        info = json.loads(j.stdout.splitlines()[0])
        f = tempfile.NamedTemporaryFile('w', suffix='.json', delete=False)
        json.dump(info, f); f.close()
        # Mỗi luồng (hình, tiếng) một yt-dlp tải kiểu gốc ra một ống, ffmpeg ghép (không mã hoá lại) thành MP4 phân
        # mảnh — ghi được vào ống, vừa tải vừa gửi nên byte đầu tới sau vài giây, không chạm giới hạn chờ 100s của
        # Cloudflare. Không dùng 1 lệnh yt-dlp -o - : khi đó yt-dlp để ffmpeg tự tải, YouTube bóp còn ~1/3 tốc độ.
        ys = [subprocess.Popen(YTDLP[:3] + ['-q', '-f', x['format_id'], '--load-info-json', f.name, '-o', '-'],
                               stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, env=ENV)
              for x in info.get('requested_formats') or [info]]
        cmd = [BIN + '/ffmpeg', '-loglevel', 'error']
        for y in ys:
            cmd += ['-i', f'pipe:{y.stdout.fileno()}']
        cmd += ['-map', '0:v:0', '-map', f'{len(ys) - 1}:a:0?', '-c', 'copy',  # ?: reel Instagram có cái không có tiếng
                '-movflags', 'frag_keyframe+empty_moov+default_base_moof', '-f', 'mp4', 'pipe:1']
        ff = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, pass_fds=[y.stdout.fileno() for y in ys])
        for y in ys:
            y.stdout.close()
        try:
            first = ff.stdout.read(1 << 16)  # đợi byte đầu: tải hỏng ngay từ đầu thì còn kịp báo lỗi
            if not first:
                return self.text(422, 'yt-dlp không tải được video')
            self.send_response(200)
            self.send_header('Content-Type', 'video/mp4')
            if title:
                self.send_header('X-Name', urllib.parse.quote(info.get('title') or info['id']))
            self.end_headers()  # không có Content-Length: HTTP/1.0 đóng kết nối là hết file
            self.wfile.write(first)
            shutil.copyfileobj(ff.stdout, self.wfile, 1 << 16)
        except (BrokenPipeError, ConnectionResetError):
            pass  # người dùng huỷ tải
        finally:
            for p in [ff] + ys:
                p.kill(); p.wait()
            os.unlink(f.name)

    def do_GET(self):
        if not hmac.compare_digest(self.headers.get('X-Key', ''), KEY):
            return self.send_error(403)
        q = urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query)
        if self.path.startswith('/yt?'):
            vid = (q.get('id') or [''])[0]
            if not re.fullmatch(r'[\w-]{11}', vid):
                return self.text(400, 'id YouTube không hợp lệ')
            return self.ytdlp('https://www.youtube.com/watch?v=' + vid)
        link = (q.get('url') or [''])[0]
        u = urllib.parse.urlsplit(link)
        if self.path.startswith('/ig?'):
            if u.scheme != 'https' or not IG.search(u.hostname or ''):
                return self.text(400, 'Chỉ nhận link Instagram')
            return self.ytdlp(link, title=False)
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
