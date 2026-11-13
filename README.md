# GMaps Photo Viewer

Một file HTML duy nhất. Dán link ảnh Google Maps ở bất kỳ dạng nào vào, xem ảnh ngay bên dưới,
và tra địa chỉ hành chính Việt Nam (2 cấp / 3 cấp) theo toạ độ.

**Dùng ngay: https://thanhnb-nbt.github.io/gmaps-photo-viewer/**

Hoặc tải `index.html` về, double-click là chạy. Không cần cài gì, không cần server, không có thư viện ngoài.

## Xem ảnh

Nhận cả bốn dạng link, dán lẫn lộn cũng được:

| Dạng | Ví dụ |
|---|---|
| Link Google Maps đầy đủ | `https://www.google.com/maps/place/.../data=!3m8!6shttps:%2F%2Flh3...` |
| CSS `background-image` | `background-image: url("https://lh3.googleusercontent.com/...=w203-h152-k-no");` |
| Link lh3 thô | `https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk...` |
| Link Google Maps Street View | `https://www.google.com/maps/place/.../@20.97,107.01,10a,75y,21.9h,90t/data=!3m7!1e1!3m5!1s<panoid>!2e0!6s...` hoặc link `streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=...` |

Ảnh Street View do Google chụp không có link lh3: ảnh lấy theo góc camera trong link Maps, qua endpoint
thumbnail **không công khai** (Google đổi là hỏng), mặc định `w=2048` — chưa đo được giới hạn tối đa của `w`.
Click ảnh Street View mở trang xem 360 trên Google Maps. Link rút gọn `maps.app.goo.gl` chưa hỗ trợ.

Dán xong là tự chuẩn hoá và hiển thị ngay (hoặc nhấn **Enter** sau khi gõ tay):

- Mọi link được cắt hậu tố kích thước và gắn `=s0` (ảnh gốc).
- Dán link mới tự xuống dòng, không đè lên link cũ.
- Link trùng bị gộp và **có báo số lượng** đã gộp — ba dạng trên cùng trỏ một ảnh thì chỉ ra một ô.
- Click ảnh mở bản `=s0`, click dòng link để copy.
- **Tải ảnh về máy**: nút `↓` dưới mỗi ảnh tải bản gốc (lh3 `=s0`, Street View `w=2048`); **Tải tất cả** tải lần lượt
  cả danh sách (trình duyệt có thể hỏi cho phép tải nhiều file). Ô *Tên file ảnh*: điền thì file mang tên đó, từ 2 ảnh
  trở lên tự thêm `_1`, `_2`… theo số thứ tự; để trống thì `gmaps_<đuôi id>` / `streetview_<panoid>`. Đuôi file lấy theo
  kiểu ảnh máy chủ trả về. Ảnh nào máy chủ không cho trang đọc thì báo "không tải được", mở ảnh rồi lưu tay.
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

## Tách ảnh món từ menu PDF

Tab **Menu PDF**: chọn (hoặc kéo thả) file PDF menu, trang cắt từng ảnh món và điền sẵn tên món.

- Khung ảnh lấy từ chính lệnh vẽ trong PDF (vị trí ảnh giao với vùng clip), nên cắt đúng mép khung, không lẫn chữ hay nền.
  Bỏ qua icon, ảnh bị che hết và ảnh nền kín trang.
- Tên món = dòng chữ to nhất in ngay dưới ảnh, không có thì dòng ngay bên phải; bỏ giá tiền và tiêu đề trang.
  Dòng lặp lại trên quá nửa số trang (hotline, website ở chân trang) và đoạn dài quá 60 ký tự cũng bị loại.
  Không chắc thì để trống — sửa/điền trong ô dưới ảnh.
- **Chọn ảnh để tải**: mỗi ảnh có ô tích (mặc định tích hết). **Bỏ chọn tất cả / Chọn tất cả** và
  **Bỏ chọn ảnh chưa có tên** (ảnh ghép, ảnh trang trí) để lọc nhanh. Nút **Tải N ảnh đã chọn**: từ 6 ảnh trở lên
  gói thành `<tên file pdf>_anh-mon.zip` kèm `_danh_sach_anh.csv` (file, mục, món có dấu, trang, kích thước);
  5 ảnh trở xuống tải từng file. Nút `↓` dưới ảnh tải riêng ảnh đó.
- Tên file: `p<trang>_<mục>_<tên món>.jpg`, không dấu (ví dụ `p23_pizza_pizza-hai-san.jpg`). Mục là tiêu đề to nhất
  của trang, trang không có tiêu đề thì bỏ phần này; ảnh chưa có tên là `p07_set-viet_anh-31.jpg`; trùng tên thì thêm `-2`.
- **Tải JSON menu** (không dùng AI): xuất `<tên pdf>_menu.json` theo khuôn `{schema_version:1, menus:[{name, type, source_url,
  content:{sections:[{name, items:[{name, note, price, price_text}]}], price_note}}]}`. Mỗi giá là một cái neo: tên món là chữ
  cùng dòng bên trái giá, hoặc khối chữ ngay trên giá trong cùng cột; dòng cỡ nhỏ hơn bên dưới là mô tả; tiêu đề to gần nhất
  phía trên là mục. Giá dưới 10.000 hiểu là nghìn đồng (`290` → 290000, giữ nguyên bản trong `price_text`).
  Giới hạn: món không ghi giá bị bỏ qua (set menu, đồ uống kèm), mọi thứ gộp vào một menu `a_la_carte`, không tự tách
  `set_menu`/`choose`/`terms`/ly-chai; menu nhiều cột sát nhau có thể dính chữ cột bên; trang lỗi font ra chữ rác. Luôn rà lại.
  Đã thử: Anantara Sea.Fire.Salt 46 món/9 mục, Zannier Nhà Ở 44/4, Café Cardinal 19/5, Lá Kitchen 59/9,
  Gyu-Kaku Grand Menu 108/22 (thiếu nhiều), Gyu-Kaku Buffet 0 (giá không ở dạng chữ đọc được).
- Đã thử trên 3 menu thật: Lá Kitchen (28 trang, 90 ảnh, 59 có tên), Gyu-Kaku Buffet (30 trang, 45 ảnh, 30 có tên),
  Gyu-Kaku Grand Menu (64 trang, 300 MB, 140 ảnh, 104 có tên, ~65 giây). Trang PDF bị lỗi font thì tên ra chữ rác, phải gõ lại.
- Chỉ dùng được với PDF xuất từ phần mềm thiết kế (có lớp chữ, ảnh là đối tượng riêng). PDF scan thì không tách được.
- Chạy hoàn toàn trong trình duyệt; lần đầu mở tab cần mạng để nạp pdf.js từ cdnjs (thư viện ngoài duy nhất của trang).
- Tự kiểm phần lõi: `node check-menu.mjs`.

## Tải video TikTok / Facebook / YouTube / Instagram / Google Maps

Dán link lấy từ nút **Chia sẻ → Sao chép liên kết** vào ô *Tải từ link* ở tab **Video**, nhấn **Tải** (hoặc Enter).

- **TikTok** (`vt.tiktok.com/…`, `www.tiktok.com/@…/video/…`): tải thẳng bản không logo nén H.264 (bản HD của TikTok thường là H.265 — nhiều máy phát ra màn đen chỉ còn tiếng), tên file
  `tiktok_<tác giả>_<id>.mp4`. Trang gửi link cho [tikwm.com](https://www.tikwm.com) để lấy link video
  (dịch vụ ngoài duy nhất của phần này, giới hạn ~1 lượt/giây). Bài slideshow ảnh thì báo không hỗ trợ.
  Có Worker (mục dưới) thì trang vẫn tự hỏi tikwm bằng IP máy mình trước (hạn mức riêng của máy, không chung
  với IP Cloudflare) rồi đưa link CDN cho Worker chuyển về. tikwm lỗi thì đưa link gốc cho
  Worker: Worker đọc thẳng trang TikTok để lấy video (trang này chỉ trả dữ liệu cho IP
  Cloudflare khoảng một nửa số lần nên thử lại 3 lần), hỏng nữa thì dự phòng [snaptikpro.net](https://snaptikpro.net),
  cuối cùng mới tới tikwm — bản free của tikwm giới hạn 10.000 lượt/ngày *theo IP*, mà IP Cloudflare dùng
  chung nên hay hết lượt.
- **Facebook** (`facebook.com/reel/…`, `/share/r/…`, `/share/v/…`, `fb.watch/…`): cũng tải qua Worker
  (mục dưới). Facebook trả trang **không có video** cho mọi IP Cloudflare (09/2026), nên Worker nhờ
  [`fbrelay.py`](fbrelay.py) trên một máy mạng nhà tải trang HTML, bóc link mp4, rồi tự kéo video từ CDN của FB.
  Mặc định lấy bản **H.264** (phát được mọi nơi): HD nếu HD là H.264, không thì SD — vì HD của reel thường là
  AV1 hoặc VP9, máy thiếu codec phát ra màn đen. Tích ô *lấy bản nét nhất* để lấy HD 1080p bất kể codec.
  Dự phòng (video riêng tư, chỉ bạn bè, hoặc máy nhà tắt): **bookmarklet** — kéo nút *⬇ Tải video FB* lên
  thanh dấu trang (Ctrl+Shift+B để hiện thanh), mở video trên Facebook rồi bấm nút đó.

- **YouTube** (`youtube.com/watch?v=…`, `/shorts/…`, `/live/…`, `youtu.be/…`, `m.`/`music.youtube.com`): link
  có mốc thời gian (`?t=90`, `&t=1m30s`, `#t=…`) hay nằm trong danh sách phát (`&list=…`) vẫn nhận — chỉ lấy id,
  tải **nguyên** video. Bản nét nhất tới 1080p nén H.264 + tiếng AAC (trên 1080p YouTube chỉ có VP9/AV1, nhiều
  máy phát ra màn đen), tên file là tiêu đề video. Chỉ tải được qua Worker + máy nhà (mục dưới): YouTube chặn
  IP Cloudflare và link video khoá theo IP máy lấy link, nên máy nhà tải rồi chuyển về. Vừa tải vừa gửi nên
  thanh tải xuống không biết trước dung lượng; tốc độ ~1,4 MB/s (giới hạn ở mạng lên của máy nhà).
- **Instagram** (`instagram.com/reel/…`, `/p/…`, `/tv/…`, link Chia sẻ): reel và bài video **công khai**, đi cùng
  đường với YouTube (yt-dlp trên máy nhà, route `/ig?url=…`), tên file `instagram_<mã bài>.mp4`. Bài nhiều
  video chỉ lấy video đầu. Story và tài khoản riêng tư cần đăng nhập nên không tải được.

- **Video Google Maps**: dán link Maps đang mở video (hoặc link lh3 của nó) vào cùng ô *Tải từ link*.
  Thêm `=dv` vào id lh3 thì Google chuyển sang file **mp4 gốc**. Có Worker thì tải qua Worker (để đặt được tên
  file); không có thì trình duyệt tải thẳng, tên do Google đặt. Link của ảnh thì báo "là ảnh, không phải video".
  (`=m18` cũng ra mp4 nhưng chỉ 360p, link khoá theo IP.)

Ô **Tên file** dưới ô link: điền thì file tải về mang tên đó (có dấu tiếng Việt được, tự thêm `.mp4`, ký tự
Windows cấm như `\ / : * ? " < > |` bị thay bằng dấu cách). Để trống thì dùng tên mặc định
(`tiktok_<tác giả>_<id>`, `facebook_<id>_<hd|sd>`, `gmaps_<đuôi id>`). Kiểm tra phần đặt tên: `node check-worker.mjs`.

### Cloudflare Worker (TikTok khi mạng chặn CDN, và Facebook)

Nếu máy không vào được CDN video của TikTok (`v16…tiktokcdn…`), cho video đi vòng qua một
Cloudflare Worker của riêng bạn — miễn phí 100.000 lượt/ngày, không lưu gì:

1. Vào [dash.cloudflare.com](https://dash.cloudflare.com) (tạo tài khoản miễn phí nếu chưa có)
   → **Workers & Pages** → **Create** → **Start with Hello World** → đặt tên → **Deploy**.
2. Bấm **Edit code**, xoá hết, dán nội dung file [`worker.js`](worker.js) → **Deploy**.
3. Chép địa chỉ dạng `https://<tên>.<tài-khoản>.workers.dev`, gán vào `const VIDEO_PROXY=''` trong `index.html`.

Có `VIDEO_PROXY` thì TikTok và Facebook đều tải qua Worker (trình duyệt tự tải, có thanh tiến độ).
Worker chỉ nhận link TikTok/Facebook, nên người khác không mượn nó làm proxy cho trang bất kỳ được.

**Facebook cần thêm máy nhà** chạy [`fbrelay.py`](fbrelay.py) (Python 3, không cần thư viện ngoài), mở ra
ngoài bằng Cloudflare Tunnel (bản hiện tại: `fbx.120203.xyz` → `localhost:8787`, service systemd `fbrelay`).
Khoá chung: `FB_RELAY_KEY` trong `~/fbrelay/fbrelay.env` trên máy nhà = secret cùng tên của Worker
(`npx wrangler secret put FB_RELAY_KEY --name gmaps-tiktok`). Relay chỉ trả trang HTML của link Facebook cho
ai có khoá; video Facebook không đi qua máy nhà.

**YouTube** cũng chạy trên relay đó (route `/yt?id=…`), cần thêm `yt-dlp`, `deno` (yt-dlp dùng để giải chữ ký
YouTube) và `ffmpeg`/`ffprobe` bản chạy độc lập trong `~/fbrelay/bin/` — không cần sudo. Cập nhật yt-dlp khi
YouTube/Instagram đổi cách chặn: `~/fbrelay/bin/yt-dlp -U`.

Không có gì được lưu lại: link chỉ nằm trong ô nhập, file tải về đi thẳng vào máy bạn.

## Xem video

Bấm **Chọn video…** hoặc kéo thả file vào khung *Xem video trong máy* ở tab **Video** — chọn nhiều file cùng lúc được.
Video phát ngay trong trình duyệt, **không tải lên đâu và không lưu lại**: tải lại trang là mất.
Nút `×` đóng video và giải phóng bộ nhớ. Phát được định dạng nào tuỳ trình duyệt (mp4/webm thì chắc chắn).

## Giao diện

Ba tab trên thanh đầu trang (thanh này dính trên cùng khi cuộn):

- **Ảnh & địa chỉ** — ô dán link ảnh và ô tra toạ độ nằm cạnh nhau, lưới ảnh ngay bên dưới.
- **Video** — tải từ link TikTok/Facebook và xem file trong máy nằm cạnh nhau, video phát bên dưới.
- **Hướng dẫn** (`#guide`) — trang này làm được gì: bốn công cụ, cách dùng từng cái, dạng link nhận được,
  thứ chưa làm được và dữ liệu đi đâu. Ô trống ở tab Ảnh cũng có ba bước bắt đầu và link sang đây.

Tab nằm trên địa chỉ trang (`#video`), nên nút Back và việc gửi link cho người khác đều mở đúng tab.
Màn hẹp (≤560px) thì các khung xếp chồng, tab chiếm trọn một hàng cho dễ bấm.

Sáng / tối, theo hệ thống hoặc bấm nút ở góc phải để chọn tay (nhớ qua `localStorage`).
Khung trải hết bề ngang màn, lưới tự thêm cột: 1 cột ở 375px, 9 cột ở 2560px.

## Kiểm thử

Cuối `index.html` có khối `console.assert` chạy mỗi lần mở trang: tách link cho cả ba dạng,
gộp trùng, tách toạ độ (kể cả bẫy `@` vs `!3d`), và điều kiện xin token mới.
Mở DevTools Console — im lặng là đạt.
