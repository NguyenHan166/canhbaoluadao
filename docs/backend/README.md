# Backend README - Lá Chắn Số

Backend là hệ thống API và xử lý nghiệp vụ cho web app **Lá Chắn Số**.

---

## 1. Mục tiêu của Backend

Backend chịu trách nhiệm:

- Xác thực và phân quyền người dùng admin.
- Quản lý bài viết.
- Quản lý chuyên mục.
- Quản lý tag.
- Quản lý media và upload file.
- Quản lý báo cáo nghi vấn lừa đảo từ người dân.
- Quản lý nguồn tin tham khảo.
- Cung cấp API cho frontend.
- Cung cấp API cho admin.
- Bảo vệ dữ liệu và xử lý nội dung an toàn.

---

## 2. Module chính

```txt
backend/
├── auth/              # Đăng nhập, refresh token, phân quyền
├── users/             # Người dùng admin
├── articles/          # Bài viết
├── categories/        # Chuyên mục
├── tags/              # Tag
├── media/             # Upload và quản lý file
├── reports/           # Báo cáo nghi vấn lừa đảo
├── sources/           # Nguồn tin
├── settings/          # Cấu hình website
├── search/            # Tìm kiếm
├── analytics/         # Thống kê cơ bản
├── common/            # Middleware, utils, constants
└── database/          # Kết nối DB, migration/schema
```

---

## 3. Thực thể dữ liệu chính

### User

```txt
id
name
email
password_hash
role
status
last_login_at
created_at
updated_at
```

### Article

```txt
id
title
slug
summary
content
content_type          # html/json
cover_image_id
category_id
tags
warning_level
source_id
source_url
author_id
status
is_featured
published_at
created_at
updated_at
```

### Category

```txt
id
name
slug
description
parent_id
icon
color
sort_order
is_visible
created_at
updated_at
```

### MediaFile

```txt
id
folder_id
original_name
stored_name
url
mime_type
size
alt_text
caption
description
uploaded_by
created_at
updated_at
```

### MediaFolder

```txt
id
name
parent_id
path
created_by
created_at
updated_at
```

### ScamReport

```txt
id
reporter_name
contact
case_type
platform
suspect_phone
suspect_url
suspect_account
description
location
attachments
status
risk_level
internal_note
created_at
updated_at
```

### Source

```txt
id
name
type
website
logo_id
description
trust_status
note
created_at
updated_at
```

### Setting

```txt
key
value
type
updated_at
```

---

## 4. API nhóm bài viết

### Public API

```txt
GET /api/public/articles
GET /api/public/articles/latest
GET /api/public/articles/featured
GET /api/public/articles/:slug
GET /api/public/categories
GET /api/public/search
```

### Admin API

```txt
GET    /api/admin/articles
POST   /api/admin/articles
GET    /api/admin/articles/:id
PATCH  /api/admin/articles/:id
DELETE /api/admin/articles/:id
PATCH  /api/admin/articles/:id/publish
PATCH  /api/admin/articles/:id/hide
PATCH  /api/admin/articles/:id/archive
```

---

## 5. API nhóm media

```txt
GET    /api/admin/media/folders
POST   /api/admin/media/folders
PATCH  /api/admin/media/folders/:id
DELETE /api/admin/media/folders/:id

GET    /api/admin/media/files
POST   /api/admin/media/upload
PATCH  /api/admin/media/files/:id
DELETE /api/admin/media/files/:id
POST   /api/admin/media/files/:id/move
```

Yêu cầu upload:

- Giới hạn dung lượng file.
- Chỉ cho phép loại file hợp lệ.
- Tự đổi tên file để tránh trùng.
- Lưu metadata vào database.
- Tạo thumbnail nếu là ảnh.
- Không cho upload file thực thi nguy hiểm.

---

## 6. API nhóm báo cáo người dân

### Public API

```txt
POST /api/public/reports
```

### Admin API

```txt
GET   /api/admin/reports
GET   /api/admin/reports/:id
PATCH /api/admin/reports/:id/status
PATCH /api/admin/reports/:id/risk-level
POST  /api/admin/reports/:id/convert-to-article
```

Trạng thái báo cáo:

```txt
pending       # Chờ kiểm tra
checking      # Đang xác minh
verified      # Đã xác minh
insufficient  # Không đủ thông tin
forwarded     # Đã chuyển cơ quan chức năng
converted     # Đã dùng để tạo bài cảnh báo
```

---

## 7. API nhóm xác thực

```txt
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

Backend cần hỗ trợ:

- Hash password.
- Access token.
- Refresh token hoặc session.
- Kiểm tra trạng thái tài khoản.
- Phân quyền theo role.

---

## 8. Phân quyền

### Vai trò

```txt
super_admin
editor
reviewer
report_manager
viewer
```

### Quyền gợi ý

```txt
article:create
article:update
article:delete
article:publish
media:manage
report:read
report:update
source:manage
user:manage
setting:manage
```

Backend phải kiểm tra quyền ở middleware/guard, không chỉ dựa vào giao diện admin.

---

## 9. Bảo mật nội dung HTML

Vì bài viết dùng Rich Text Editor/WYSIWYG, backend cần xử lý kỹ nội dung HTML.

Yêu cầu:

- Sanitize HTML trước khi lưu hoặc trước khi trả ra frontend.
- Chỉ cho phép các thẻ an toàn như p, h1, h2, h3, strong, em, ul, ol, li, a, img, table, blockquote.
- Loại bỏ script, iframe nguy hiểm, event handler như onclick.
- Validate URL trong thẻ a và img.
- Với ảnh, ưu tiên dùng ảnh đã upload qua Media Library.

---

## 10. Bảo mật upload file

- Chỉ cho phép MIME type hợp lệ.
- Không tin vào đuôi file người dùng gửi.
- Kiểm tra dung lượng.
- Đổi tên file khi lưu.
- Không lưu file upload trong thư mục có thể thực thi script.
- Có thể scan file nếu cần mở rộng.
- Tạo URL truy cập công khai cho ảnh được phép hiển thị.
- Tách file báo cáo nhạy cảm khỏi file công khai nếu cần.

---

## 11. Tìm kiếm

Backend nên hỗ trợ tìm kiếm theo:

- Tiêu đề bài viết.
- Nội dung tóm tắt.
- Tag.
- Chuyên mục.
- Mức độ cảnh báo.
- Nguồn tin.
- Số điện thoại/link nghi vấn trong báo cáo đã xác minh nếu được phép công khai.

---

## 12. Log và audit

Nên lưu log các hành động quan trọng:

- Đăng nhập.
- Đăng xuất.
- Tạo bài viết.
- Sửa bài viết.
- Xóa bài viết.
- Xuất bản bài viết.
- Upload file.
- Xóa file.
- Duyệt báo cáo.
- Thay đổi phân quyền.
- Thay đổi cấu hình website.

---

## 13. Nguyên tắc API response

Response nên thống nhất định dạng:

```json
{
  "success": true,
  "message": "Thao tác thành công",
  "data": {},
  "meta": {}
}
```

Khi lỗi:

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": []
}
```

---

## 14. Các việc backend cần ưu tiên

1. Auth và phân quyền admin.
2. CRUD bài viết.
3. Rich text content storage.
4. Upload media theo folder.
5. API chèn ảnh vào bài viết.
6. Public API hiển thị bài viết.
7. Form báo cáo nghi vấn lừa đảo.
8. Admin xử lý báo cáo.
9. Sanitize HTML.
10. Log hoạt động quản trị.
