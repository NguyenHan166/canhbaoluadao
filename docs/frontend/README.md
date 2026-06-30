# Frontend README - Lá Chắn Số

Frontend là website công khai cho người dân đọc tin tức, cảnh báo, kiến thức và gửi báo cáo nghi vấn lừa đảo.

---

## 1. Mục tiêu của Frontend

Frontend cần giúp người dân:

- Xem nhanh các cảnh báo lừa đảo mới nhất.
- Đọc tin tức và kiến thức an toàn số bằng ngôn ngữ dễ hiểu.
- Nhận biết thủ đoạn lừa đảo phổ biến.
- Tìm kiếm theo chủ đề, số điện thoại, đường link hoặc từ khóa.
- Gửi báo cáo nghi vấn lừa đảo.
- Chia sẻ cảnh báo cho người thân, bạn bè, cộng đồng.

---

## 2. Phong cách giao diện

Frontend nên có phong cách như một cổng thông tin điện tử chuyên đề:

- Tin cậy.
- Rõ ràng.
- Dễ đọc.
- Gần giống trải nghiệm đọc báo điện tử.
- Không giật tít.
- Không gây hoang mang.
- Tối ưu mobile.
- Phù hợp với người dùng phổ thông và người lớn tuổi.

Tông màu gợi ý:

- Xanh navy: tin cậy, an ninh.
- Xanh lá/teal: an toàn, xác minh.
- Cam/đỏ: cảnh báo.
- Trắng/xám nhạt: nền đọc dễ chịu.

---

## 3. Các trang chính

```txt
frontend/
├── home/             # Trang chủ
├── latest/           # Tin mới nhất
├── categories/       # Chuyên mục
├── articles/         # Chi tiết bài viết
├── scam-alerts/      # Cảnh báo lừa đảo
├── knowledge/        # Kiến thức an toàn số
├── tips/             # Kỹ năng & mẹo
├── report/           # Báo cáo nghi vấn lừa đảo
├── sources/          # Nguồn tin chính thống
├── search/           # Tìm kiếm
└── static-pages/     # Giới thiệu, điều khoản, bảo mật
```

---

## 4. Trang chủ

Trang chủ nên có bố cục dạng báo điện tử/cổng thông tin.

### Thành phần chính

- Header logo.
- Menu chuyên mục.
- Thanh tìm kiếm.
- Dải cảnh báo khẩn.
- Tin nổi bật.
- Cảnh báo lừa đảo mới.
- Tin mới nhất.
- Kiến thức & kỹ năng.
- Mẹo an toàn hôm nay.
- Nguồn tin chính thống.
- Form/CTA báo cáo nghi vấn.
- Footer.

### Menu chuyên mục gợi ý

- Mới nhất.
- An ninh mạng.
- An toàn số.
- Cảnh báo lừa đảo.
- Kiến thức.
- Kỹ năng & mẹo.
- Báo cáo.
- Cộng đồng.
- Video / Infographic.
- Hỏi đáp.

---

## 5. Trang danh sách bài viết

Trang danh sách dùng cho chuyên mục hoặc kết quả tìm kiếm.

### Cần có

- Tiêu đề chuyên mục.
- Mô tả ngắn.
- Danh sách bài viết.
- Bộ lọc.
- Tìm kiếm.
- Phân trang hoặc tải thêm.
- Sidebar bài đọc nhiều / cảnh báo nổi bật.

### Thông tin trên card bài viết

- Ảnh đại diện.
- Tiêu đề.
- Tóm tắt.
- Chuyên mục.
- Mức độ cảnh báo.
- Nguồn tin.
- Ngày xuất bản.
- Thời gian đọc.
- Nút đọc tiếp.

---

## 6. Trang chi tiết bài viết

Trang chi tiết bài viết phải ưu tiên khả năng đọc và hướng dẫn hành động.

### Cấu trúc gợi ý

- Chuyên mục.
- Mức độ cảnh báo.
- Tiêu đề.
- Tóm tắt.
- Ảnh đại diện.
- Ngày xuất bản.
- Nguồn tham khảo.
- Link bài gốc.
- Nội dung chính.
- Hộp tóm tắt nhanh.
- Hộp cảnh báo quan trọng.
- Hướng dẫn phòng tránh.
- Nút chia sẻ.
- Bài viết liên quan.
- CTA báo cáo trường hợp tương tự.

### Các block nội dung thường gặp

- Vụ việc là gì?
- Thủ đoạn lừa đảo.
- Dấu hiệu nhận biết.
- Người dân cần làm gì?
- Nếu đã lỡ cung cấp thông tin thì xử lý thế nào?
- Nguồn tham khảo.

---

## 7. Trang báo cáo nghi vấn lừa đảo

Trang này cho phép người dân gửi thông tin nghi vấn.

### Form cần có

- Họ và tên, tùy chọn.
- Số điện thoại/email liên hệ, tùy chọn.
- Loại vụ việc.
- Nền tảng xảy ra: Zalo, Facebook, SMS, cuộc gọi, email, website, khác.
- Số điện thoại / link / tài khoản nghi vấn.
- Nội dung mô tả.
- Địa phương, tùy chọn.
- Upload ảnh chụp màn hình.
- Checkbox xác nhận.
- Nút gửi báo cáo.

### Lưu ý hiển thị

Cần có thông báo rõ:

> Không gửi mật khẩu, mã OTP, số tài khoản đầy đủ hoặc thông tin quá nhạy cảm. Thông tin báo cáo sẽ được quản trị viên kiểm tra trước khi sử dụng để cảnh báo cộng đồng.

---

## 8. Tìm kiếm

Tìm kiếm cần hỗ trợ:

- Từ khóa bài viết.
- Chủ đề lừa đảo.
- Số điện thoại nghi vấn.
- Đường link nghi vấn.
- Tên nền tảng.
- Tên nguồn tin.

Kết quả tìm kiếm nên có bộ lọc:

- Theo chuyên mục.
- Theo mức độ cảnh báo.
- Theo thời gian.
- Theo nguồn tin.

---

## 9. Quick Checker

Quick Checker là module kiểm tra nhanh dấu hiệu nghi vấn.

Người dùng có thể nhập:

- Số điện thoại.
- Đường link.
- Nội dung tin nhắn.
- Tài khoản mạng xã hội.

Kết quả chỉ nên mang tính tham khảo:

```txt
safe_unknown      # Chưa có dữ liệu nghi vấn rõ ràng
suspicious        # Có dấu hiệu nghi vấn
dangerous         # Nguy cơ cao
need_more_info    # Cần thêm thông tin
```

Luôn hiển thị cảnh báo:

> Kết quả kiểm tra chỉ mang tính tham khảo. Khi có thiệt hại hoặc nguy cơ nghiêm trọng, người dùng cần liên hệ cơ quan chức năng hoặc ngân hàng liên quan.

---

## 10. SEO và chia sẻ mạng xã hội

Frontend cần hỗ trợ:

- Meta title.
- Meta description.
- Open Graph image.
- Canonical URL.
- Slug thân thiện.
- Sitemap.
- Robots.txt.
- Structured data cho bài viết nếu cần.
- Ảnh có alt text.
- Tối ưu tốc độ tải trang.

---

## 11. Responsive

Ưu tiên mobile-first vì nhiều người dùng sẽ đọc bằng điện thoại.

### Mobile cần có

- Header gọn.
- Menu hamburger.
- Nút báo cáo nhanh.
- Card bài viết dễ bấm.
- Font đủ lớn.
- Khoảng cách dòng dễ đọc.
- Form báo cáo đơn giản.

---

## 12. Nguyên tắc hiển thị nội dung

- Không làm giao diện giống trang giật tít.
- Không hiển thị thông tin cá nhân nhạy cảm từ báo cáo cộng đồng.
- Với nội dung chưa xác minh, phải gắn nhãn rõ.
- Với nội dung lấy từ nguồn khác, phải hiển thị nguồn tham khảo.
- Với cảnh báo khẩn, phải có hướng dẫn hành động cụ thể.
