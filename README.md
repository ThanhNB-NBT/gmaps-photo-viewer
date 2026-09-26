# GMaps Photo Viewer

Một file HTML duy nhất. Dán link ảnh Google Maps ở bất kỳ dạng nào vào, xem ảnh ngay bên dưới,
và tra địa chỉ hành chính Việt Nam (2 cấp / 3 cấp) theo toạ độ.

**Dùng ngay: https://thanhnb-nbt.github.io/gmaps-photo-viewer/**

Hoặc tải `index.html` về, double-click là chạy. Không cần cài gì, không cần server, không có thư viện ngoài.

## Xem ảnh

Nhận cả ba dạng link, dán lẫn lộn cũng được:

| Dạng | Ví dụ |
|---|---|
| Link Google Maps đầy đủ | `https://www.google.com/maps/place/.../data=!3m8!6shttps:%2F%2Flh3...` |
| CSS `background-image` | `background-image: url("https://lh3.googleusercontent.com/...=w203-h152-k-no");` |
| Link lh3 thô | `https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk...` |

Dán xong là tự chuẩn hoá và hiển thị ngay (hoặc nhấn **Enter** sau khi gõ tay):

- Mọi link được cắt hậu tố kích thước và gắn `=s0` (ảnh gốc).
- Dán link mới tự xuống dòng, không đè lên link cũ.
- Link trùng bị gộp và **có báo số lượng** đã gộp — ba dạng trên cùng trỏ một ảnh thì chỉ ra một ô.
- Click ảnh mở bản `=s0`, click dòng link để copy.
- Link được đánh số, số nằm **ngoài** ô nhập nên bôi đen chép link không dính số vào.
  Rê chuột lên một dòng link thì số đó và ô ảnh tương ứng cùng sáng lên, và ngược lại.
- **Copy tất cả** chép toàn bộ ô nhập. Nút `×` xoá từng link — một cột bên phải ô nhập
  (cũng nằm ngoài textarea như số thứ tự), và một nút nữa dưới mỗi ô ảnh; xoá xong
  số tự đánh lại từ 1.

**Vì sao lưới không tải thẳng `=s0`:** ảnh gốc có thể là 12000×9000 (~108 megapixel), tải hàng chục
giây và ngốn vài chục MB mỗi tấm. Lưới dùng bản thu nhỏ (mặc định 800px, đổi được ở ô *Preview*),
còn `=s0` chỉ tải khi bạn click.

## Tra địa chỉ theo toạ độ

Nhập `12.2653665, 109.1953678` — hoặc dán thẳng link Google Maps, nó tự tách toạ độ.

```
2 cấp   Phường Bắc Nha Trang, Khánh Hòa
3 cấp   Phường Vĩnh Phước, Nha Trang, Khánh Hòa
```

Dùng API công khai của [gis.vn](https://gis.vn/api) (`vn2000.vn/api/locationinfo`).

- Mỗi token chỉ dùng được **10 lượt cho mỗi API**. Hết lượt, trang tự gọi `/api/get-token`
  lấy token mới rồi tra lại — đúng như tài liệu của họ hướng dẫn. Bạn không phải làm gì.
- Có key vĩnh viễn của gis.vn thì dán vào ô *Token*, key đó sẽ được ưu tiên và không bị thay.
- Trong link Maps, `!3d/!4d` là toạ độ địa điểm còn `@lat,lng` là vị trí camera (lệch ~20-30m),
  nên phần tách toạ độ ưu tiên `!3d/!4d`.

Đây là phần **duy nhất** cần mạng. Phần xem ảnh chạy hoàn toàn cục bộ.

## Tải video TikTok / Facebook

Dán link lấy từ nút **Chia sẻ → Sao chép liên kết** vào ô *Tải từ link* ở tab **Video**, nhấn **Tải** (hoặc Enter).

- **TikTok** (`vt.tiktok.com/…`, `www.tiktok.com/@…/video/…`): tải thẳng bản không logo nén H.264 (bản HD của TikTok thường là H.265 — nhiều máy phát ra màn đen chỉ còn tiếng), tên file
  `tiktok_<tác giả>_<id>.mp4`. Trang gửi link cho [tikwm.com](https://www.tikwm.com) để lấy link video
  (dịch vụ ngoài duy nhất của phần này, giới hạn ~1 lượt/giây). Bài slideshow ảnh thì báo không hỗ trợ.
- **Facebook** (`facebook.com/reel/…`, `/share/r/…`, `/share/v/…`, `fb.watch/…`): cũng tải qua Worker
  (mục dưới) — Worker mở trang video không đăng nhập, bóc link mp4 rồi trả về. Reel đã chạy; trang
  `/videos/…` / `/watch?v=…` cũ thì Facebook hay chặn IP Cloudflare. Bản HD của reel thường là **AV1 1080p**:
  Chrome/Edge/Firefox phát được, Windows cần *AV1 Video Extension* (miễn phí, Win 11 thường có sẵn).
  Dự phòng (video riêng tư, chỉ bạn bè, hoặc Worker lỗi): **bookmarklet** — kéo nút *⬇ Tải video FB* lên
  thanh dấu trang, mở video trên Facebook rồi bấm nút đó; nó chạy với tài khoản bạn đang đăng nhập.

### Cloudflare Worker (TikTok khi mạng chặn CDN, và Facebook)

Nếu máy không vào được CDN video của TikTok (`v16…tiktokcdn…`), cho video đi vòng qua một
Cloudflare Worker của riêng bạn — miễn phí 100.000 lượt/ngày, không lưu gì:

1. Vào [dash.cloudflare.com](https://dash.cloudflare.com) (tạo tài khoản miễn phí nếu chưa có)
   → **Workers & Pages** → **Create** → **Start with Hello World** → đặt tên → **Deploy**.
2. Bấm **Edit code**, xoá hết, dán nội dung file [`worker.js`](worker.js) → **Deploy**.
3. Chép địa chỉ dạng `https://<tên>.<tài-khoản>.workers.dev`, gán vào `const VIDEO_PROXY=''` trong `index.html`.

Có `VIDEO_PROXY` thì TikTok và Facebook đều tải qua Worker (trình duyệt tự tải, có thanh tiến độ).
Worker chỉ nhận link TikTok/Facebook, nên người khác không mượn nó làm proxy cho trang bất kỳ được.

Không có gì được lưu lại: link chỉ nằm trong ô nhập, file tải về đi thẳng vào máy bạn.

## Xem video

Bấm **Chọn video…** hoặc kéo thả file vào khung *Xem video trong máy* ở tab **Video** — chọn nhiều file cùng lúc được.
Video phát ngay trong trình duyệt, **không tải lên đâu và không lưu lại**: tải lại trang là mất.
Nút `×` đóng video và giải phóng bộ nhớ. Phát được định dạng nào tuỳ trình duyệt (mp4/webm thì chắc chắn).

## Giao diện

Hai tab trên thanh đầu trang (thanh này dính trên cùng khi cuộn):

- **Ảnh & địa chỉ** — ô dán link ảnh và ô tra toạ độ nằm cạnh nhau, lưới ảnh ngay bên dưới.
- **Video** — tải từ link TikTok/Facebook và xem file trong máy nằm cạnh nhau, video phát bên dưới.

Tab nằm trên địa chỉ trang (`#video`), nên nút Back và việc gửi link cho người khác đều mở đúng tab.
Màn hẹp (≤560px) thì các khung xếp chồng, tab chiếm trọn một hàng cho dễ bấm.

Sáng / tối, theo hệ thống hoặc bấm nút ở góc phải để chọn tay (nhớ qua `localStorage`).
Khung trải hết bề ngang màn, lưới tự thêm cột: 1 cột ở 375px, 9 cột ở 2560px.

## Kiểm thử

Cuối `index.html` có khối `console.assert` chạy mỗi lần mở trang: tách link cho cả ba dạng,
gộp trùng, tách toạ độ (kể cả bẫy `@` vs `!3d`), và điều kiện xin token mới.
Mở DevTools Console — im lặng là đạt.
