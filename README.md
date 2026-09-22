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

Nhấn **Enter** để chuẩn hoá và hiển thị:

- Mọi link được cắt hậu tố kích thước và gắn `=s0` (ảnh gốc).
- Dán link mới tự xuống dòng, không đè lên link cũ.
- Link trùng bị gộp và **có báo số lượng** đã gộp — ba dạng trên cùng trỏ một ảnh thì chỉ ra một ô.
- Click ảnh mở bản `=s0`, click dòng link để copy.
- Link được đánh số, số nằm **ngoài** ô nhập nên bôi đen chép link không dính số vào.
  Rê chuột lên một dòng link thì số đó và ô ảnh tương ứng cùng sáng lên, và ngược lại.

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

## Giao diện

Sáng / tối, theo hệ thống hoặc bấm nút ở góc phải để chọn tay (nhớ qua `localStorage`).
Khung trải hết bề ngang màn, lưới tự thêm cột: 1 cột ở 375px, 9 cột ở 2560px.

## Kiểm thử

Cuối `index.html` có khối `console.assert` chạy mỗi lần mở trang: tách link cho cả ba dạng,
gộp trùng, tách toạ độ (kể cả bẫy `@` vs `!3d`), và điều kiện xin token mới.
Mở DevTools Console — im lặng là đạt.
