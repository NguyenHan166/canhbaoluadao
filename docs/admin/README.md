# Admin README - Lá Chắn Số

Trang Admin là hệ thống quản trị nội dung cho web app **Lá Chắn Số**. Phân hệ này phục vụ quản trị viên, biên tập viên và người duyệt nội dung.

---

## 1. Mục tiêu của Admin

Admin được xây dựng để:

- Viết, chỉnh sửa, duyệt và xuất bản bài viết.
- Quản lý chuyên mục, tag và mức độ cảnh báo.
- Quản lý thư viện ảnh/tệp tin theo dạng thư mục giống máy tính.
- Chèn ảnh/tệp từ Media Library vào nội dung bài viết.
- Kiểm duyệt báo cáo nghi vấn lừa đảo do người dân gửi.
- Quản lý nguồn tin chính thống.
- Quản lý người dùng và phân quyền.
- Cấu hình thông tin chung của website.

---

## 2. Các module chính

```txt
admin/
├── dashboard/          # Tổng quan hệ thống
├── articles/           # Quản lý bài viết
├── editor/             # Trình soạn thảo bài viết
├── media/              # Quản lý ảnh và tệp tin
├── categories/         # Quản lý chuyên mục
├── reports/            # Quản lý báo cáo người dân
├── sources/            # Quản lý nguồn tin
├── users/              # Quản lý tài khoản admin
├── settings/           # Cấu hình website
└── auth/               # Đăng nhập, đăng xuất, phân quyền
```

---

## 3. Dashboard tổng quan

Dashboard cần hiển thị nhanh tình trạng hệ thống:

- Tổng số bài viết.
- Bài nháp.
- Bài chờ duyệt.
- Bài đã xuất bản.
- Cảnh báo khẩn cấp.
- Báo cáo người dân gửi.
- Báo cáo chờ kiểm tra.
- Lượt xem hôm nay.
- Nguồn tin đang sử dụng.

Ngoài ra nên có:

- Danh sách bài viết mới nhất.
- Danh sách báo cáo mới nhất.
- Danh sách cảnh báo nổi bật.
- Thông báo việc cần xử lý.

---

## 4. Quản lý bài viết

Trang danh sách bài viết cần có:

### Cột dữ liệu

- Tiêu đề.
- Chuyên mục.
- Mức độ cảnh báo.
- Nguồn tin.
- Trạng thái.
- Tác giả.
- Ngày tạo.
- Ngày xuất bản.
- Lượt xem.
- Hành động: xem, sửa, nhân bản, ẩn, xóa.

### Bộ lọc

- Từ khóa.
- Chuyên mục.
- Trạng thái.
- Mức độ cảnh báo.
- Nguồn tin.
- Khoảng thời gian.

### Trạng thái bài viết

```txt
draft       # Bản nháp
review      # Chờ duyệt
published   # Đã xuất bản
hidden      # Đã ẩn
archived    # Lưu trữ
```

---

## 5. Trang viết bài

Trang viết bài là phần quan trọng nhất của Admin.

### Trường thông tin bài viết

- Tiêu đề bài viết.
- Slug.
- Tóm tắt ngắn.
- Chuyên mục.
- Tag.
- Mức độ cảnh báo.
- Ảnh đại diện.
- Nguồn tham khảo.
- Link bài gốc.
- Tác giả / người biên tập.
- Trạng thái bài viết.
- Hẹn giờ xuất bản.
- Bài nổi bật.
- Hiển thị ngoài trang chủ.

---

## 6. Rich Text Editor giống Word

Trình soạn thảo cần là **Rich Text Editor / WYSIWYG Editor**.

Mục tiêu là để admin viết bài giống như soạn văn bản trong Word.

### Tính năng cơ bản

- Viết văn bản trực tiếp.
- Tiêu đề H1, H2, H3.
- Đoạn văn thường.
- Bôi đậm.
- In nghiêng.
- Gạch chân.
- Gạch ngang.
- Danh sách bullet.
- Danh sách đánh số.
- Căn trái, căn giữa, căn phải, căn đều.
- Chèn link.
- Chèn ảnh.
- Chèn bảng.
- Chèn trích dẫn.
- Chèn đường kẻ ngang.
- Undo / redo.
- Copy nội dung từ Word và giữ định dạng cơ bản.
- Xem trước bài viết.
- Soạn toàn màn hình.
- Lưu nháp tự động.

### Block nội dung đặc biệt

Các bài cảnh báo nên có sẵn các block:

- Tóm tắt nhanh.
- Thủ đoạn lừa đảo.
- Dấu hiệu nhận biết.
- Cách phòng tránh.
- Nếu đã lỡ cung cấp thông tin thì làm gì?
- Cảnh báo quan trọng.
- Nguồn tham khảo.

### Dữ liệu editor

Nội dung có thể lưu dưới một trong hai dạng:

- HTML sạch.
- JSON rich text.

Khi hiển thị ngoài frontend, backend hoặc frontend phải sanitize nội dung để tránh mã độc XSS.

### Gợi ý thư viện

- TipTap.
- CKEditor.
- TinyMCE.
- Quill.

Ưu tiên thư viện hỗ trợ ảnh, bảng, block tùy chỉnh và khả năng mở rộng.

---

## 7. Media Library

Media Library là trình quản lý ảnh/tệp tin giống file manager trên máy tính.

### Chức năng chính

- Tạo thư mục.
- Đổi tên thư mục.
- Xóa thư mục.
- Upload ảnh/tệp.
- Upload nhiều file.
- Kéo thả file để upload.
- Di chuyển file giữa các thư mục.
- Đổi tên file.
- Xóa file.
- Tìm kiếm file.
- Xem trước ảnh.
- Sao chép URL file.
- Chọn ảnh để chèn vào bài viết.

### Cấu trúc thư mục gợi ý

```txt
/uploads
├── articles
│   └── 2026
│       ├── 06
│       └── 07
├── scam-alerts
├── knowledge
├── reports
├── banners
├── icons
└── documents
```

### Thông tin file

Mỗi file nên có:

- Tên file gốc.
- Tên file lưu trữ.
- URL.
- MIME type.
- Dung lượng.
- Thư mục.
- Người upload.
- Ngày upload.
- Alt text.
- Caption.
- Mô tả.
- Trạng thái sử dụng.

---

## 8. Luồng chèn ảnh vào bài viết

```txt
Admin mở trang viết bài
→ Đặt con trỏ tại vị trí cần chèn ảnh
→ Bấm nút "Chèn ảnh"
→ Mở modal Media Library
→ Chọn ảnh có sẵn hoặc upload ảnh mới
→ Chọn thư mục lưu ảnh
→ Nhập alt text/caption nếu cần
→ Bấm "Chèn vào bài viết"
→ Ảnh xuất hiện đúng vị trí con trỏ trong editor
```

Sau khi chèn, admin có thể:

- Chỉnh kích thước ảnh.
- Căn trái / giữa / phải.
- Thêm hoặc sửa caption.
- Thay thế ảnh.
- Xóa ảnh khỏi nội dung bài viết.

---

## 9. Quản lý báo cáo người dân

Trang này dùng để kiểm duyệt thông tin do người dân gửi.

### Dữ liệu báo cáo

- Người gửi.
- Thông tin liên hệ.
- Loại vụ việc.
- Nền tảng xảy ra: Zalo, Facebook, SMS, cuộc gọi, email, website, khác.
- Số điện thoại / link / tài khoản nghi vấn.
- Nội dung mô tả.
- Ảnh chụp màn hình.
- Địa phương.
- Thời gian gửi.
- Trạng thái xử lý.
- Ghi chú nội bộ.

### Trạng thái xử lý

```txt
pending       # Chờ kiểm tra
checking      # Đang xác minh
verified      # Đã xác minh
insufficient  # Không đủ thông tin
forwarded     # Đã chuyển cơ quan chức năng
converted     # Đã dùng để tạo bài cảnh báo
```

### Chức năng

- Xem chi tiết báo cáo.
- Duyệt / từ chối.
- Gắn nhãn mức độ nguy hiểm.
- Ghi chú nội bộ.
- Ẩn dữ liệu cá nhân.
- Chuyển báo cáo thành bài cảnh báo.

---

## 10. Quản lý nguồn tin

Nguồn tin là các cơ quan, báo chí, tổ chức hoặc đơn vị được dùng để tham khảo khi biên soạn bài.

Mỗi nguồn có:

- Tên nguồn.
- Website.
- Loại nguồn.
- Logo.
- Mô tả.
- Trạng thái tin cậy.
- Ghi chú.

---

## 11. Người dùng và phân quyền

### Vai trò

```txt
super_admin
editor
reviewer
report_manager
viewer
```

### Quyền gợi ý

- Tạo bài viết.
- Sửa bài viết.
- Xóa bài viết.
- Xuất bản bài viết.
- Quản lý media.
- Quản lý báo cáo.
- Quản lý nguồn tin.
- Quản lý người dùng.
- Cấu hình website.

---

## 12. Yêu cầu bảo mật cho Admin

- Chỉ người dùng đã đăng nhập mới truy cập được.
- Kiểm tra quyền ở cả frontend và backend.
- Không tin dữ liệu từ client.
- Validate file upload.
- Chặn file nguy hiểm.
- Sanitize nội dung HTML.
- Có xác nhận trước khi xóa.
- Có log hành động quan trọng.
- Có cơ chế tự động đăng xuất hoặc refresh token an toàn.
