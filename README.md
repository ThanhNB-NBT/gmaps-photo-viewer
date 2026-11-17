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
- **Copy tất cả** chép toàn bộ ô nhập. Copy một link: bấm số dòng (số tạm thành ✓), hoặc nút copy ở cột bên phải ô nhập, ngay hàng số thứ tự
  (khỏi kéo xuống tìm ô ảnh), hoặc bấm dòng link dưới ảnh. Ô ảnh xếp lưới nhỏ (từ 150px, điện thoại 2 cột). Nút `×` xoá từng link — một cột bên phải ô nhập
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

Chọn nhiều PDF một lúc thì đọc lần lượt, ảnh mọi file nối vào cùng một lưới; tên ảnh thêm tiền tố tên PDF
(`seoulkitchen_p01_…`), JSON gộp mỗi file thành một menu, zip tên `menu_<số file>-pdf_anh-mon.zip`. File lỗi được báo
tên rồi bỏ qua, các file khác vẫn đọc tiếp.

- Khung ảnh lấy từ chính lệnh vẽ trong PDF (vị trí ảnh giao với vùng clip), nên cắt đúng mép khung, không lẫn chữ hay nền.
  Bỏ qua icon, ảnh bị che hết và ảnh nền kín trang (trừ trang không có chữ nào — trang chỉ in một ảnh món; bìa cũng
  lọt vào, bỏ chọn tay). Ảnh vẽ trùng hai lần giữ một; từ 4 mảnh khít nhau trở lên (hình trang trí bị cắt thành lưới ô)
  gộp thành một khung; khung bị chữ phủ quá 8% diện tích là tấm nền sau đoạn văn, bỏ. Khung chứa trọn một khung khác
  chiếm ≥ 30% nó (ảnh món cắt nền chồng nhau, ảnh trên tấm nền nửa trang) thì giữ khung trong.
- Độ nét: mỗi khung được vẽ riêng ở đúng độ phân giải của ảnh gốc trong PDF (cạnh dài tối đa 2400px), không phóng cố
  định ×3 như trước — pdf.js phóng ảnh quá ~1,33 lần thì tắt làm mượt nên ảnh gốc thưa (đa số menu chỉ 1–2 px/pt) bị
  vỡ ô vuông. Ảnh gốc thưa hơn 3 px/pt được phóng lên ×3 bằng nội suy chất lượng cao rồi làm nét nhẹ (unsharp mask).
  Không thêm được chi tiết mà ảnh gốc không có. Ảnh phải phóng ≥2 lần (gốc ≤1,5 px/pt) ghi “mờ” ở góc thẻ, kèm nút
  **Copy prompt làm nét** để gửi ảnh cho AI tạo ảnh (Gemini, ChatGPT). Chạy ESRGAN ngay trong trình duyệt đã thử và bỏ:
  GPU yếu mất WebGL context sau 1–2 ảnh (Chrome chặn WebGL luôn cho trang), CPU mất ~2,5 phút/ảnh.
- Tên món, thử lần lượt: ảnh có số in đè (`23`) thì lấy món đánh số `23. …` trên trang; tên in đè trong ảnh mà chữ to hơn
  dòng dưới ảnh; dòng chữ to nhất in ngay dưới ảnh; nhãn gần ảnh nhất (trên, trái hoặc in đè lên ảnh, trong
  40pt, bỏ qua dòng thuộc món có giá ở cột bên); không có nữa thì dòng ngay bên phải. Bỏ giá tiền và tiêu đề trang.
  Mảnh chữ Việt pdf.js tách rời (`B`,`ò`) mà sát nhau thì nối liền, không chèn dấu cách.
  Tên in hoa thì dừng ở dòng mô tả cùng cỡ chữ; bỏ số thứ tự `23.` và giá `— 280` dính ở đầu/cuối. Giá dạng `VND 220`,
  `$90`, `500/100gr`, tên mục `MEAT - CÁC MÓN THỊT` và chữ chạy theo đường cong bị vỡ (`T U HT`) không lấy làm tên.
  Dưới ảnh chỉ xét khối chữ sát ảnh nhất (khoảng trống dọc là sang khối khác, vd tiêu đề mục kế tiếp). Tên chỉ có chữ
  Hán/Hàn thì nối dòng tên Latin ngay dưới (`涼拌青瓜海蜇 Aromatic Sesame Jelly Fish Salad`), dừng ở mã dị ứng `(S,G)`.
  Không lấy: câu mô tả kết thúc bằng dấu chấm, hàng chữ nhiều cột cách xa nhau, chú giải in lặp ở hai nửa trang đôi.
  Dòng lặp lại trên quá nửa số trang (hotline, website ở chân trang) và đoạn dài quá 60 ký tự cũng bị loại.
  Không chắc thì để trống — sửa/điền trong ô dưới ảnh.
- **Chọn ảnh để tải**: mỗi ảnh có ô tích (mặc định tích hết). **Bỏ chọn tất cả / Chọn tất cả** và
  **Bỏ chọn ảnh chưa có tên** (ảnh ghép, ảnh trang trí) để lọc nhanh. Nút **Tải N ảnh đã chọn**: từ 6 ảnh trở lên
  gói thành `<tên file pdf>_anh-mon.zip` kèm `_danh_sach_anh.csv` (file, mục, món có dấu, trang, kích thước);
  5 ảnh trở xuống tải từng file. Nút `↓` dưới ảnh tải riêng ảnh đó.
- **Tạo link 7 ngày**: tải ảnh đã chọn lên [`fbrelay.py`](fbrelay.py) trên máy nhà (`POST /up`, cần khoá
  `FB_RELAY_KEY` — dán vào ô *Khoá máy chủ ảnh*, chỉ lưu trong trình duyệt). Mỗi ảnh ra link công khai
  `https://fbx.120203.xyz/i/<mã ngẫu nhiên>-<tên file>.jpg` để đưa cho CDN/bên thứ 3; link hiện dưới ảnh (bấm để copy),
  cả danh sách `tên món<tab>link` được copy sẵn, CSV trong zip có thêm cột `link`. Sau 7 ngày link trả 404 và file bị xoá
  (`Cache-Control: max-age` = thời gian còn sống nên CDN cũng không giữ quá hạn). Mỗi ảnh ≤ 10 MB, chỉ JPEG,
  tổng thư mục `~/fbrelay/img` ≤ 2 GB.
- **Mở link PDF**: dán link vào ô dưới nút Chọn file rồi Enter, trình duyệt tải thẳng. Chỉ được khi website chứa PDF cho
  CORS; website chặn thì trang báo một dòng kèm link mở ở tab mới để tải về rồi chọn file (không nhờ máy nhà tải hộ).
- Khung hướng dẫn chiếm chỗ lưới ảnh khi tab trống; ẩn khi ô link có chữ hoặc đã có ảnh, hiện lại khi xoá trắng.
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
  Lượt 16/11 (ảnh / có tên, trước → sau): Le Jardin 35/22 → 14/14 (bỏ tấm nền và ảnh trùng, tên đúng hết), Bao Cancún 57/21
  → 6/5 (lá trang trí cắt lưới ô), KOSHIMA 31/18 → 32/21, Indigo đọc được tên in đè, InterContinental Hà Nội bỏ hết tên
  rác `VND 220` (caption dưới ảnh là chữ dạng đường vẽ, không đọc được). Menu nhiều món chung một ảnh nền (Long Triều
  Dimsum) thì không tách được.
  Lượt 2 (19 menu: phở, BBQ Hàn, Thái, dim sum, cafe, Nhật; ~10 menu có ảnh): Shangri-La Bangkok dim sum 37/37 tên song ngữ
  (trước chỉ chữ Hán, 1 tên là tiêu đề mục), Nha Trang đồ uống có thêm tên tiếng Anh, Dusit Signature Thai 12/11 → 12/0
  (ảnh không có chú thích, trước toàn lấy nhầm chú giải ký hiệu), CoverManager (ảnh bát cắt nền) 100/62 → 52/33 hết khung
  chồng chéo, Seoul Kitchen 45/22 → 43/19 (bỏ khung nền và tên ghép 2 món). Menu ảnh xếp tự do, tên in lệch xa ảnh
  (CoverManager, Vignette) vẫn sai/trống một phần.
- Chỉ dùng được với PDF xuất từ phần mềm thiết kế (có lớp chữ, ảnh là đối tượng riêng). PDF scan thì không tách được.
- Chạy hoàn toàn trong trình duyệt (trừ nút Tạo link); lần đầu mở tab cần mạng để nạp pdf.js từ cdnjs (thư viện ngoài
  duy nhất của trang).
- Tự kiểm phần lõi: `node check-menu.mjs`.

### Gemini / Claude đọc tên món + viết menu (tuỳ chọn)

Mở mục **Gemini / Claude (tuỳ chọn)** dưới thanh nút, dán một hoặc nhiều API key (mỗi dòng một key, lấy ở
[AI Studio](https://aistudio.google.com/apikey)), chọn model. Không điền key thì mọi thứ chạy như cũ.

- **Ảnh chụp menu** (JPEG/PNG/WebP…, chọn hoặc kéo thả nhiều ảnh, lẫn với PDF cũng được): ảnh không có ảnh món nhúng
  hay lớp chữ nên không tự cắt / tự đọc được, chỉ để Gemini / Claude đọc. Mọi ảnh chọn cùng lúc gộp thành **một menu
  nhiều trang**, xếp theo tên file (số tăng dần: `IMG_9` trước `IMG_10`); ảnh trình duyệt không mở được (HEIC trên
  Chrome) thì báo riêng. Đã thử 2 trang Kirin-DimSum vẽ ra JPEG: Gemini đọc 33 món, bằng đúng lúc đọc từ PDF.

- Nút **Gemini đọc tên món + viết menu** gửi **một lượt mỗi trang PDF**: ảnh trang (cạnh dài ≤1600px) có vẽ khung đỏ
  đánh số các ảnh đã cắt, theo thứ tự đọc (trên → dưới, trái → phải). Gemini trả tên món cho từng khung số và toàn bộ
  mục/món/giá của trang; tên chỉ ghi đè khi Gemini trả tên không rỗng (khung trang trí giữ tên cũ), JSON menu được
  thay bằng bản Gemini viết (mục trùng tên liền nhau được gộp qua các trang).
- JSON Gemini tách theo dạng menu: Gemini gắn nhãn từng mục là món lẻ / đồ uống / thuộc set, code gom lại thành
  `a_la_carte` (tên PDF), `beverage` (`<tên PDF> - Đồ uống`) và mỗi set có giá một `set_menu` (tên set, `price`, `terms`
  là danh sách điều kiện in kèm); set không thấy giá ở trang nào thì trả về `a_la_carte`. Mục "chọn N món" có `choose`.
  Đồ uống in giá ly và chai ghi `glass`/`bottle` thay cho `price`; menu in nhiều cỡ ly ("5,50 / 7,25 / 19,95") thì code
  lấy số đầu làm giá ly, số cuối làm giá chai. Chưa điền `courses`, `periods`, `images`.
  Đã thử: Pho-UK tách 9 mục món + 16 mục đồ uống (9 vang có ly/chai), SLB AYCE ra `set_menu` 1088 kèm điều kiện,
  Long Triều giữ `a_la_carte`. Flash-lite đôi khi xếp tasting menu thành món lẻ (DV-Saigon "Vittorio"), rà lại tay.
  Tự kiểm phần gom: `node check-menu.mjs`.
- Chống sót món: mỗi trang gửi kèm **chữ trích từ lớp text của PDF** (chép tên/giá đúng từng chữ). Code đếm các mảnh chữ
  trông như giá ("320", "1.050", "1'500", "— 280") rồi so với JSON Gemini trả; còn giá chưa có thì đọc lại trang **một lần**
  kèm danh sách giá bị sót, giữ bản sót ít hơn, còn sót thì ghi tên trang ở dòng thông báo để soát tay. Món nhiều cỡ
  hay nhiều lựa chọn in dưới tên (Chicken 270 / Prawns 300) ghi thành "`<tên> - <cỡ/lựa chọn>`" mỗi cái một món;
  dòng gọi thêm ngay dưới một món ("+ Add Cheese 60") vào `note` của món đó, không thành món riêng; mục in một giá chung (VEGGIE SIDES 110) thì mọi món nhận giá đó.
  PDF scan (không có lớp chữ) chỉ còn ảnh, không tự kiểm được.
- Trang lỗi không bị bỏ im lặng: JSON hỏng / bị cắt thì đọc lại tối đa 3 lượt, hết lượt các trang thì đọc lại các
  trang lỗi thêm một vòng; vẫn lỗi thì dòng thông báo ghi **CHƯA ĐỦ** kèm số trang. Bấm lại nút chỉ đọc các trang còn
  thiếu (kết quả trang đã đọc được nhớ tới khi mở PDF khác).
  Đã thử Mediterra 16 trang (flash-lite, 1 key): 47 món đủ, 2 lần 503 tự vượt qua, 68 giây.
- Đọc **song song**: mỗi key 4 luồng, tối đa 8 luồng, cùng rút trang từ một hàng đợi; key nào đang ít request nhất thì
  nhận request tiếp. Không mở mỗi trang một luồng vì free tier giới hạn lượt/phút, mở quá nhiều chỉ ăn 429.
  Thử giả lập (2 key, mỗi request 1,5 giây) PDF 26 trang: tối đa 7 request cùng lúc, chia 17/17 cho 2 key, 16 giây
  thay vì ~40 giây đọc tuần tự.
- Nhiều key: mỗi lượt chọn key đang không chờ và dùng ít nhất, và tự giữ nhịp dưới hạn mức phút của free tier
  (flash-lite 14, flash 4, gemma 29 request/phút mỗi key). Lỗi 429 theo phút → chờ đúng `retryDelay` Google trả.
  429 ghi "theo ngày" **chưa tin ngay**: gửi dồn dập thì Google cũng trả nhãn này dù còn lượt (thử thật: 4/18 request
  bị, bảng AI Studio vẫn 256/500), nên key chỉ nghỉ 1 phút; gạch key tới hết ngày khi đã đếm ≥95% hạn mức ngày hoặc
  lỗi "theo ngày" kéo dài 3 phút không xen request nào qua. 503 → lùi dần 4, 8, 16… giây (tối đa 1 phút); một trang chờ quá 6 phút thì tính là
  lỗi. Key sai (400/403) → bỏ. Hết mọi key thì dừng và báo.
- Giới hạn hiển thị là **ước tính** của free tier (flash-lite 500 lượt/ngày, flash 20, gemma 14400) đếm trong máy;
  Google không trả số lượt còn lại qua API. Ngày tính theo giờ Los Angeles (lúc Google đặt lại hạn mức).
- Model sinh ảnh và 3.1-pro không có hạn mức free nên bị lọc khỏi danh sách.
- **Claude** dùng chung ô key: dán key `sk-ant-…` (lấy ở [console.anthropic.com](https://console.anthropic.com/settings/keys))
  là danh sách model có thêm `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5` kèm giá $/1M token; model đang chọn
  quyết định dùng key hãng nào. Trang gọi thẳng `api.anthropic.com/v1/messages` (header
  `anthropic-dangerous-direct-browser-access`), cùng prompt và cùng schema (đổi sang JSON Schema qua `output_config.format`,
  nên JSON luôn đúng khuôn). Opus/Sonnet bật `fallbacks: "default"`: bộ lọc an toàn từ chối nhầm thì Anthropic tự chạy lại
  bằng model dự phòng. Claude không có free tier: thay cho lượt, trang hiện **số tiền ước tính** từ `usage` trả về.
  Lỗi: 529/5xx → lùi dần như Gemini; 429 → chờ theo `retry-after`; 401/403 → bỏ key; 400 "credit balance" → key hết tiền.
- Key lưu trong `localStorage` (`gpv-gemini`) của trình duyệt, chỉ gửi thẳng tới `generativelanguage.googleapis.com` / `api.anthropic.com`.
  Mọi trang trên `thanhnb-nbt.github.io` dùng chung origin này — đừng dùng máy chung.

## Up ảnh lấy link

Tab **Up ảnh**: kéo thả, dán (Ctrl+V) hoặc chọn nhiều ảnh, mỗi ảnh tự tải lên cùng máy chủ ảnh tạm với Menu PDF
(`POST /up`, cần khoá) và ra một link công khai sống 7 ngày. Ảnh xếp lưới ô nhỏ (điện thoại 2 cột), dưới mỗi ảnh là tên ảnh, góc trên phải có icon copy (bấm tên hay icon đều copy link), ảnh đã copy có ✓ trước tên, ảnh vừa copy có viền sáng, trỏ chuột vào ảnh hiện tên đầy đủ, bấm ảnh mở bản đã tải. Máy chủ chỉ nhận JPEG ≤10 MB
nên ảnh khác (PNG, WebP…) được vẽ lại ra JPEG trong trình duyệt (chỗ trong suốt thành nền trắng, GIF mất chuyển động),
ảnh quá 10 MB thu nhỏ dần cho vừa. Mỗi ảnh up xong được ghi vào lịch sử trong `localStorage` (`gpv-uphist`: link,
hạn, tên, cỡ) và hiện ngay ở mục **Ảnh đã up trên trình duyệt này** (mục luôn hiện, kể cả khi trống, để người dùng
biết có nó); mở lại trang vẫn thấy các link còn hạn, mục quá hạn tự bị bỏ lúc mở trang.

**Mã lịch sử** (thay cho tài khoản): lần up đầu trang tạo mã 12 ký tự ngẫu nhiên (`gpv-upid`, dạng `ABCD-EFGH-JKMN`, bỏ
I L O 0 1). Mỗi lần up gửi kèm `&id=&fname=&meta=`, relay ghi vào `hist/<mã>.json`; `GET /hist?id=` không cần khoá
(mã ~59 bit là chìa) trả các ảnh còn hạn. Máy khác nhập mã → trang gộp lịch sử máy chủ với bản trong trình duyệt và
từ đó up tiếp theo mã đó. Máy chủ không trả lời thì vẫn hiện bản trong trình duyệt. Link chỉ có trong trình duyệt
(up trước khi có mã, hoặc có sẵn ở máy vừa nhập mã) được đưa lên mã qua `POST /hist?id=` (cần khoá): relay chỉ nhận
link `/i/` còn file trên đĩa, hạn tính theo file chứ không theo trình duyệt. Người đã có lịch sử + khoá thì mở trang
là có mã ngay, khỏi đợi lần up sau. **Xoá lịch sử** xoá danh sách và
quên mã trên trình duyệt này (có hỏi lại); file lịch sử trên máy chủ tự xoá khi mã không up gì thêm trong 7 ngày.

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
