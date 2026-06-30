# Lá Chắn Số

**Lá Chắn Số** là một web app/cổng thông tin cộng đồng về **an toàn số, an ninh mạng và phòng chống lừa đảo trực tuyến**. Ứng dụng hướng tới người dân phổ thông, đặc biệt là người dùng ở địa phương, người lớn tuổi, học sinh, phụ huynh, tiểu thương và những người chưa có nhiều kiến thức về công nghệ.

Mục tiêu của hệ thống không phải là tạo một trang báo điện tử, mà là một nền tảng **tổng hợp, biên soạn, giải thích và cảnh báo** dựa trên các nguồn chính thống, giúp người dân dễ hiểu, dễ nhớ và biết cách xử lý khi gặp dấu hiệu lừa đảo.

---

## 1. Mục tiêu sản phẩm

Ứng dụng được xây dựng để:

- Cập nhật các tin tức, cảnh báo mới nhất về an toàn thông tin, an ninh mạng và lừa đảo trực tuyến.
- Biên soạn lại thông tin từ các nguồn uy tín theo cách dễ hiểu với người dân.
- Hướng dẫn kỹ năng tự bảo vệ tài khoản, thiết bị, dữ liệu và tiền bạc.
- Cho phép người dân gửi báo cáo nghi vấn lừa đảo.
- Tạo kho kiến thức, mẹo phòng tránh, checklist an toàn số.
- Hỗ trợ quản trị viên viết bài, quản lý ảnh/tệp, quản lý nguồn tin và duyệt báo cáo.
- Tạo một hệ thống có thể mở rộng thành cổng cảnh báo cộng đồng tại địa phương.

---

## 2. Đối tượng người dùng

### Người dùng ngoài website

- Người dân muốn đọc cảnh báo lừa đảo mới nhất.
- Người cần tìm hiểu cách nhận biết thủ đoạn lừa đảo.
- Người muốn kiểm tra một số điện thoại, đường link hoặc nội dung tin nhắn đáng ngờ.
- Người muốn gửi báo cáo nghi vấn lừa đảo cho quản trị viên.
- Người cần hướng dẫn xử lý khi đã lỡ cung cấp thông tin hoặc chuyển tiền.

### Người quản trị

- Quản trị viên hệ thống.
- Biên tập viên viết bài.
- Người duyệt bài.
- Người kiểm tra báo cáo cộng đồng.
- Người quản lý nguồn tin và thư viện media.

---

## 3. Các phân hệ chính

Dự án gồm 3 phần chính:

```txt
la-chan-so/
├── frontend/      # Website công khai cho người dân
├── admin/         # Trang quản trị nội dung
├── backend/       # API, cơ sở dữ liệu, xác thực, xử lý nghiệp vụ
└── docs/          # Tài liệu mô tả sản phẩm, API, quy trình
```

### Frontend

Website công khai hiển thị tin tức, cảnh báo, kiến thức, mẹo hữu ích và form báo cáo nghi vấn lừa đảo.

### Admin

Trang quản trị dùng để viết bài, quản lý chuyên mục, quản lý ảnh/tệp tin, duyệt báo cáo người dân và cấu hình website.

### Backend

Hệ thống API xử lý dữ liệu, xác thực, phân quyền, lưu bài viết, lưu media, quản lý báo cáo, quản lý người dùng và cung cấp dữ liệu cho frontend/admin.

---

## 4. Định hướng nội dung

Website tập trung vào các nhóm nội dung:

- **Tin mới nhất:** các thông tin cập nhật về an toàn số và an ninh mạng.
- **Cảnh báo lừa đảo:** các thủ đoạn đang xuất hiện hoặc có nguy cơ cao.
- **Kiến thức an toàn số:** giải thích các khái niệm quan trọng bằng ngôn ngữ dễ hiểu.
- **Kỹ năng & mẹo:** hướng dẫn thực hành như bật 2FA, kiểm tra link, bảo vệ tài khoản.
- **Báo cáo cộng đồng:** các thông tin nghi vấn do người dân gửi, được kiểm duyệt trước khi công khai.
- **Nguồn tin chính thống:** danh sách nguồn tham khảo uy tín.

---

## 5. Nguyên tắc nội dung

Hệ thống cần tuân thủ các nguyên tắc sau:

- Không giật tít, không câu view, không gây hoang mang.
- Không tự nhận là cơ quan báo chí hoặc cơ quan chức năng.
- Luôn ghi rõ nguồn tham khảo và link bài gốc khi sử dụng thông tin từ nơi khác.
- Ưu tiên tự biên soạn, tóm tắt, giải thích và hướng dẫn thay vì sao chép nguyên văn.
- Không công khai dữ liệu cá nhân nhạy cảm của người gửi báo cáo.
- Với các báo cáo cộng đồng, phải có trạng thái xác minh rõ ràng.
- Nội dung cảnh báo cần đi kèm hướng dẫn hành động cụ thể.

---

## 6. Luồng người dùng chính

### Đọc cảnh báo

```txt
Người dùng vào website
→ Xem cảnh báo nổi bật / tin mới nhất
→ Mở bài viết
→ Đọc tóm tắt, thủ đoạn, dấu hiệu nhận biết, cách phòng tránh
→ Chia sẻ cho người thân hoặc báo cáo trường hợp tương tự
```

### Gửi báo cáo nghi vấn lừa đảo

```txt
Người dùng mở trang "Báo cáo nghi vấn"
→ Nhập loại vụ việc, nền tảng xảy ra, link/số điện thoại đáng ngờ
→ Mô tả nội dung
→ Upload ảnh chụp màn hình nếu có
→ Gửi báo cáo
→ Admin kiểm tra trong trang quản trị
```

### Quản trị viết bài

```txt
Admin đăng nhập
→ Vào mục Bài viết
→ Tạo bài mới
→ Nhập tiêu đề, tóm tắt, chuyên mục, nguồn tin
→ Soạn nội dung bằng Rich Text Editor giống Word
→ Chèn ảnh từ Media Library
→ Lưu nháp / gửi duyệt / xuất bản
```

---

## 7. Các tính năng quan trọng

### Website công khai

- Trang chủ kiểu cổng thông tin.
- Danh sách bài viết theo chuyên mục.
- Trang chi tiết bài viết.
- Tìm kiếm bài viết.
- Bộ lọc theo chủ đề, mức độ cảnh báo, nguồn tin.
- Form báo cáo nghi vấn lừa đảo.
- Khu vực mẹo an toàn số.
- Khu vực nguồn tin chính thống.
- Chia sẻ bài viết qua mạng xã hội.
- Giao diện mobile-first.

### Trang admin

- Dashboard tổng quan.
- Quản lý bài viết.
- Trình soạn thảo Rich Text Editor/WYSIWYG giống Word.
- Media Library dạng quản lý thư mục.
- Upload ảnh/tệp và chèn ảnh vào bài viết.
- Quản lý chuyên mục.
- Quản lý báo cáo người dân.
- Quản lý nguồn tin.
- Quản lý người dùng và phân quyền.
- Cấu hình website.

### Backend

- API xác thực và phân quyền.
- API bài viết.
- API chuyên mục.
- API media.
- API báo cáo.
- API nguồn tin.
- API người dùng.
- API cấu hình website.
- Upload file an toàn.
- Sanitize HTML trước khi hiển thị.
- Log hoạt động quản trị.

---

## 8. Mô hình trạng thái bài viết

```txt
draft       # Bản nháp
review      # Chờ duyệt
published   # Đã xuất bản
hidden      # Đã ẩn
archived    # Lưu trữ
```

Mỗi bài viết nên có:

- Tiêu đề.
- Slug.
- Tóm tắt.
- Nội dung HTML/JSON rich text.
- Ảnh đại diện.
- Chuyên mục.
- Tag.
- Mức độ cảnh báo.
- Nguồn tham khảo.
- Link bài gốc.
- Tác giả/biên tập viên.
- Trạng thái.
- Thời gian tạo.
- Thời gian cập nhật.
- Thời gian xuất bản.

---

## 9. Mức độ cảnh báo

```txt
normal      # Thông tin thông thường
notice      # Cần chú ý
warning     # Cảnh báo
urgent      # Khẩn cấp
verified    # Đã xác minh
```

---

## 10. Định hướng kỹ thuật

Tech stack có thể thay đổi theo lựa chọn triển khai, nhưng nên có cấu trúc rõ ràng:

### Frontend

- React / Next.js / Vue / Nuxt tùy định hướng.
- Giao diện responsive.
- SEO tốt cho bài viết.
- Tối ưu tốc độ tải trang.
- Hỗ trợ chia sẻ mạng xã hội.

### Admin

- React / Next.js / Vue.
- Rich Text Editor: TipTap, CKEditor, TinyMCE hoặc Quill.
- Media Library dạng file manager.
- UI component library tùy chọn.

### Backend

- Node.js/NestJS/Express hoặc framework backend phù hợp.
- Database: PostgreSQL, MySQL hoặc MongoDB.
- Object storage/local storage cho media.
- JWT/session authentication.
- Role-based access control.
- API REST hoặc GraphQL.

---

## 11. Yêu cầu bảo mật cơ bản

- Chỉ admin đăng nhập mới truy cập trang quản trị.
- Có phân quyền rõ ràng theo vai trò.
- Validate dữ liệu đầu vào.
- Sanitize nội dung HTML trước khi lưu/hiển thị.
- Giới hạn loại file upload.
- Kiểm tra dung lượng file upload.
- Không cho upload file thực thi nguy hiểm.
- Ẩn thông tin cá nhân nhạy cảm trong báo cáo cộng đồng.
- Có log thao tác quan trọng: đăng nhập, tạo bài, sửa bài, xóa bài, xuất bản bài.
- Cấu hình CORS, rate limit và bảo vệ API cơ bản.

---

## 12. Mục tiêu dài hạn

- Xây dựng kho dữ liệu cảnh báo lừa đảo theo địa phương.
- Có công cụ kiểm tra nhanh link/số điện thoại/nội dung đáng ngờ.
- Tạo hệ thống quiz hoặc bài học ngắn về an toàn số.
- Cho phép chia sẻ cảnh báo qua Zalo/Facebook.
- Có dashboard thống kê xu hướng lừa đảo.
- Có thể kết nối với chatbot tư vấn an toàn số.
- Có thể mở rộng thành cổng cảnh báo cộng đồng cho xã/huyện/tỉnh.

---

## 13. Tài liệu liên quan

- `frontend/README.md`: mô tả website công khai.
- `admin/README.md`: mô tả trang quản trị.
- `backend/README.md`: mô tả API và nghiệp vụ backend.
- `docs/PRODUCT_SCOPE.md`: phạm vi sản phẩm.
- `docs/CONTENT_GUIDELINES.md`: nguyên tắc biên tập nội dung.
