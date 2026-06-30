# Kế hoạch & Prompts Triển khai Backend - Lá Chắn Số (MongoDB + Cloudflare R2)

Tài liệu này cung cấp **kế hoạch triển khai** chi tiết cho phần Backend của hệ thống **Lá Chắn Số** sử dụng **MongoDB Atlas** và **Cloudflare R2 Object Storage**, cùng **các prompt mẫu** được thiết kế sẵn để bạn có thể copy-paste dần cho AI thực hiện từng phần.

---

## 1. Kế Hoạch Tổng Quan (Architecture & Tech Stack)

### Tech Stack Đề Xuất
- **Runtime & Language**: Node.js + TypeScript (đồng bộ với Frontend & Admin).
- **Framework**: Express (nhẹ nhàng, linh hoạt, tốc độ phát triển nhanh).
- **Database & ORM**: **MongoDB (MongoDB Atlas)** + **Prisma ORM**.
- **Object Storage (File Upload)**: **Cloudflare R2** (S3-compatible API) sử dụng AWS SDK v3.
- **Thư viện bổ trợ**:
  - `@aws-sdk/client-s3` (SDK kết nối Cloudflare R2)
  - `bcryptjs` (hash mật khẩu)
  - `jsonwebtoken` (xác thực JWT)
  - `multer` (nhận file qua multipart/form-data lưu trong RAM buffer)
  - `sanitize-html` (lọc mã độc XSS trong bài viết)
  - `express-validator` (validate request body)
  - `cors`, `helmet`, `morgan` (bảo mật và ghi log request)

### Cấu Trúc Thư Mục Backend
```txt
backend/
├── prisma/
│   ├── schema.prisma       # Cấu trúc database Prisma (MongoDB Provider)
│   └── seed.ts             # Script tạo dữ liệu mẫu (admin, categories)
├── src/
│   ├── config/             # Cấu hình môi trường (db, R2 S3 Client, jwt)
│   ├── middlewares/        # Auth guard, RBAC, validator, error handler
│   ├── modules/            # Các tính năng nghiệp vụ
│   │   ├── auth/           # Login, logout, refresh, profile
│   │   ├── users/          # CRUD quản trị viên
│   │   ├── categories/     # Chuyên mục bài viết
│   │   ├── articles/       # Soạn thảo, tìm kiếm, hiển thị bài viết
│   │   ├── media/          # Thư viện ảnh/file (upload trực tiếp R2), quản lý folder
│   │   ├── reports/        # Tin báo lừa đảo từ người dân
│   │   ├── sources/        # Nguồn tin tức tham khảo
│   │   └── settings/       # Cấu hình hệ thống (key-value)
│   ├── utils/              # Helper (HTML sanitizer, logger, R2 uploader helper)
│   ├── app.ts              # Khởi tạo Express app
│   └── server.ts           # Điểm khởi chạy server
├── package.json
└── tsconfig.json
```

---

## 2. Danh Sách Các Bước Triển Khai (Prompts Checklist)

Dưới đây là 8 prompt tương ứng với 8 bước để xây dựng hệ thống từ đầu đến hoàn thiện.

### Bước 1: Khởi tạo dự án & Cấu hình môi trường
> [!NOTE]
> Tạo boilerplate dự án Node.js Express + TypeScript, cấu hình build và môi trường dev.

* **Prompt Copy:**
```text
Hãy khởi tạo dự án Backend bằng Node.js, Express và TypeScript trong thư mục `backend/` của tôi.
Yêu cầu cụ thể:
1. Tạo file `package.json` với các dependency: express, dotenv, cors, helmet, morgan, bcryptjs, jsonwebtoken, multer, @aws-sdk/client-s3, sanitize-html, express-validator, @prisma/client. devDependency bao gồm prisma, typescript, ts-node-dev, @types/express, @types/cors, @types/bcryptjs, @types/jsonwebtoken, @types/multer, @types/sanitize-html, @types/morgan, @types/node.
2. Tạo cấu hình `tsconfig.json` tối ưu cho Node.js app sử dụng module resolution hiện đại.
3. Tạo file `src/server.ts` và `src/app.ts` khởi tạo một ứng dụng Express đơn giản có tích hợp JSON parser, CORS, helmet, morgan để log requests, một endpoint test `GET /` trả về trạng thái hoạt động của hệ thống, và middleware xử lý lỗi tập trung.
4. Cấu hình script "dev" sử dụng `ts-node-dev` và script "build" sử dụng `tsc` để biên dịch sang thư mục `dist/`.
5. Tạo file `.env.example` chứa các biến:
   - PORT=3001
   - DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lanchanso?retryWrites=true&w=majority"
   - JWT_SECRET="your-super-secret-key"
   - JWT_REFRESH_SECRET="your-super-refresh-secret-key"
   - R2_ACCOUNT_ID="your-cloudflare-account-id"
   - R2_ACCESS_KEY_ID="your-r2-access-key-id"
   - R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
   - R2_BUCKET_NAME="lanchanso-media"
   - R2_PUBLIC_URL="https://pub-xxxxxx.r2.dev" (hoặc custom domain của bạn)
```

---

### Bước 2: Thiết kế Database Schema (MongoDB Atlas) & Seed Dữ Liệu
> [!IMPORTANT]
> Vì sử dụng MongoDB với Prisma:
> - Cần cấu hình `provider = "mongodb"` trong datasource.
> - Các trường ID khóa chính phải định nghĩa kiểu `String @id @default(auto()) @map("_id") @db.ObjectId`.
> - Các liên kết/khóa ngoại phải sử dụng kiểu dữ liệu `String @db.ObjectId`.
> - MongoDB không hỗ trợ tính năng migrations truyền thống (Prisma migrate), do đó ta sẽ đồng bộ schema bằng lệnh `npx prisma db push`.

* **Prompt Copy:**
```text
Hãy thiết lập Prisma ORM với MongoDB cho dự án backend trong thư mục `backend/`.
Yêu cầu cụ thể:
1. Định nghĩa file `prisma/schema.prisma` với provider là `mongodb`. Các model cần định nghĩa bao gồm:
   - User:
     * id: String @id @default(auto()) @map("_id") @db.ObjectId
     * name: String
     * email: String @unique
     * passwordHash: String
     * role: String (super_admin/editor/reviewer/report_manager/viewer)
     * status: String (active/inactive)
     * lastLoginAt: DateTime?
     * createdAt: DateTime @default(now())
     * updatedAt: DateTime @updatedAt
   - Category:
     * id: String @id @default(auto()) @map("_id") @db.ObjectId
     * name: String
     * slug: String @unique
     * description: String?
     * parentId: String? @db.ObjectId
     * icon: String?
     * color: String?
     * sortOrder: Int @default(0)
     * isVisible: Boolean @default(true)
     * createdAt: DateTime @default(now())
     * updatedAt: DateTime @updatedAt
   - Article:
     * id: String @id @default(auto()) @map("_id") @db.ObjectId
     * title: String
     * slug: String @unique
     * summary: String
     * content: String
     * contentType: String @default("html")
     * coverImageId: String? @db.ObjectId
     * categoryId: String @db.ObjectId
     * tags: String[]
     * warningLevel: String (normal/notice/warning/urgent/verified)
     * sourceId: String? @db.ObjectId
     * sourceUrl: String?
     * authorId: String @db.ObjectId
     * status: String (draft/review/published/hidden/archived)
     * isFeatured: Boolean @default(false)
     * views: Int @default(0)
     * publishedAt: DateTime?
     * createdAt: DateTime @default(now())
     * updatedAt: DateTime @updatedAt
   - MediaFolder:
     * id: String @id @default(auto()) @map("_id") @db.ObjectId
     * name: String
     * parentId: String? @db.ObjectId
     * path: String
     * createdBy: String @db.ObjectId
     * createdAt: DateTime @default(now())
     * updatedAt: DateTime @updatedAt
   - MediaFile:
     * id: String @id @default(auto()) @map("_id") @db.ObjectId
     * folderId: String? @db.ObjectId
     * originalName: String
     * storedName: String
     * url: String (Địa chỉ URL của file trên Cloudflare R2)
     * mimeType: String
     * size: Int
     * altText: String?
     * caption: String?
     * description: String?
     * uploadedBy: String @db.ObjectId
     * createdAt: DateTime @default(now())
     * updatedAt: DateTime @updatedAt
   - ScamReport:
     * id: String @id @default(auto()) @map("_id") @db.ObjectId
     * reporterName: String?
     * contact: String?
     * caseType: String
     * platform: String
     * suspectPhone: String?
     * suspectUrl: String?
     * suspectAccount: String?
     * description: String
     * location: String?
     * attachments: String[]
     * status: String @default("pending") (pending/checking/verified/insufficient/forwarded/converted)
     * riskLevel: String?
     * internalNote: String?
     * createdAt: DateTime @default(now())
     * updatedAt: DateTime @updatedAt
   - Source:
     * id: String @id @default(auto()) @map("_id") @db.ObjectId
     * name: String
     * type: String
     * website: String?
     * logoId: String? @db.ObjectId
     * description: String?
     * trustStatus: String (verified/unverified)
     * note: String?
     * createdAt: DateTime @default(now())
     * updatedAt: DateTime @updatedAt
   - Setting:
     * id: String @id @default(auto()) @map("_id") @db.ObjectId
     * key: String @unique
     * value: String
     * type: String @default("string")
     * updatedAt: DateTime @updatedAt
2. Hãy thiết lập quan hệ phù hợp giữa các thực thể bằng Prisma `@relation`.
3. Viết script seed dữ liệu mẫu trong file `prisma/seed.ts` để:
   - Tạo 1 tài khoản Super Admin mặc định: [EMAIL_ADDRESS] / mật khẩu: [PASSWORD] (nhớ mã hóa bằng bcrypt trước khi lưu).
   - Tạo các Category mặc định: "Cảnh báo lừa đảo" (canh-bao-lua-dao), "An ninh mạng" (an-ninh-mang), "Kiến thức an toàn số" (kien-thuc), "Kỹ năng & Mẹo" (meo-huu-ich), "Báo cáo cộng đồng" (cong-dong).
   - Tạo một vài tin tức/báo cáo mẫu để tiện test.
4. Cấu hình Prisma client và cập nhật package.json để chạy seed tự động khi deploy.
```

---

### Bước 3: Module Xác Thực (Auth) & Phân Quyền (RBAC)
> [!NOTE]
> Xây dựng hệ thống đăng nhập, cấp JWT (Access Token, Refresh Token) và middleware kiểm tra quyền hạn.

* **Prompt Copy:**
```text
Hãy viết module xác thực (Auth) và phân quyền dựa trên vai trò (RBAC) trong thư mục `backend/src/modules/auth` và `backend/src/middlewares`.
Yêu cầu cụ thể:
1. Tạo Prisma Client helper dùng chung trong `src/config/db.ts`.
2. Tạo các endpoint cho Auth:
   - `POST /api/auth/login`: Nhận email & password, kiểm tra tài khoản, trả về Access Token (hạn 15 phút), Refresh Token (hạn 7 ngày) và thông tin user.
   - `POST /api/auth/refresh`: Nhận Refresh Token, xác thực và trả về Access Token mới.
   - `POST /api/auth/logout`: Xóa token.
   - `GET /api/auth/me`: Nhận Access Token từ Header Bearer, trả về thông tin profile của user hiện tại.
3. Tạo middleware `requireAuth` kiểm tra tính hợp lệ của Access Token.
4. Tạo middleware `requireRoles(roles: string[])` kiểm tra xem user hiện tại có vai trò phù hợp không (ví dụ: super_admin, editor, v.v.).
5. Đăng ký các route này vào ứng dụng Express chính ở `src/app.ts`.
```

---

### Bước 4: APIs Chuyên Mục (Categories) & Nguồn Tin (Sources)
> [!NOTE]
> Xây dựng các API CRUD cho Category và Source với phân quyền Public vs Admin.

* **Prompt Copy:**
```text
Hãy xây dựng module Quản lý Chuyên mục (Categories) và Nguồn tin tham khảo (Sources) trong thư mục `src/modules/categories` và `src/modules/sources`.
Yêu cầu cụ thể:
1. APIs Chuyên mục (Categories):
   - Public: `GET /api/public/categories` - Lấy danh sách chuyên mục hiển thị công khai (isVisible = true), hỗ trợ sắp xếp theo `sortOrder`.
   - Admin (yêu cầu quyền `editor` hoặc `super_admin` trở lên):
     - `POST /api/admin/categories` - Tạo chuyên mục mới (auto-generate slug từ tên).
     - `PATCH /api/admin/categories/:id` - Cập nhật chuyên mục.
     - `DELETE /api/admin/categories/:id` - Xóa chuyên mục (kiểm tra nếu đang có bài viết thuộc chuyên mục thì chặn xóa hoặc chuyển bài viết).
2. APIs Nguồn tin (Sources):
   - Public: `GET /api/public/sources` - Lấy danh sách nguồn tin chính thống đã xác minh.
   - Admin (yêu cầu quyền `editor` hoặc `super_admin`):
     - CRUD đầy đủ cho Source (`GET /api/admin/sources`, `POST /api/admin/sources`, `PATCH /api/admin/sources/:id`, `DELETE /api/admin/sources/:id`).
3. Sử dụng `express-validator` để xác thực dữ liệu đầu vào (ví dụ: tên không được trống, slug không trùng lặp, website phải đúng định dạng URL).
```

---

### Bước 5: APIs Bài Viết (Articles) & Lọc Mã Độc XSS (Sanitizer)
> [!IMPORTANT]
> Lưu ý: MongoDB xử lý tìm kiếm văn bản rất tốt. Cần sanitize nội dung HTML trước khi lưu vào DB.

* **Prompt Copy:**
```text
Hãy xây dựng module Quản lý Bài viết (Articles) trong thư mục `src/modules/articles` có tích hợp bộ lọc mã độc HTML Sanitizer.
Yêu cầu cụ thể:
1. Tạo một hàm helper `sanitizeHtml` trong `src/utils/sanitizer.ts` sử dụng thư viện `sanitize-html`. Hàm này chỉ cho phép các thẻ HTML an toàn (p, h1, h2, h3, strong, em, ul, ol, li, a, img, table, blockquote, code) và các thuộc tính an toàn (href, src, alt, class). Loại bỏ triệt để các script, thẻ iframe nguy hiểm và các thuộc tính sự kiện (onclick, onerror, v.v.).
2. APIs Công cộng (Public Articles):
   - `GET /api/public/articles` - Lấy danh sách bài viết đã xuất bản (`status = 'published'`), hỗ trợ phân trang, tìm kiếm theo tiêu đề/tóm tắt/tag, và lọc theo `categoryId` hoặc `warningLevel`.
   - `GET /api/public/articles/latest` - Lấy 5 bài viết mới nhất.
   - `GET /api/public/articles/featured` - Lấy các bài viết nổi bật (`isFeatured = true`).
   - `GET /api/public/articles/:slug` - Chi tiết bài viết theo slug, tăng lượt xem mỗi lần đọc (lưu ý tìm bài theo slug string và update views).
3. APIs Quản trị (Admin Articles - Yêu cầu auth & quyền `editor` hoặc `super_admin` trở lên):
   - `GET /api/admin/articles` - Lấy toàn bộ bài viết (kèm bộ lọc trạng thái nháp/duyệt/ẩn).
   - `POST /api/admin/articles` - Tạo bài viết mới. Nội dung `content` phải được chạy qua `sanitizeHtml` trước khi lưu vào MongoDB. Tự động sinh `slug` duy nhất từ tiêu đề.
   - `GET /api/admin/articles/:id` - Lấy chi tiết bài viết theo ID để sửa.
   - `PATCH /api/admin/articles/:id` - Cập nhật thông tin bài viết. Nội dung sửa cũng phải được sanitize.
   - `DELETE /api/admin/articles/:id` - Xóa bài viết.
   - `PATCH /api/admin/articles/:id/status` - Cập nhật trạng thái bài viết nhanh (đổi trạng thái nháp, chờ duyệt, xuất bản, ẩn).
```

---

### Bước 6: APIs Quản lý Media Thư Mục & File Upload lên Cloudflare R2
> [!IMPORTANT]
> Thay vì lưu file local, hệ thống sẽ sử dụng Cloudflare R2 Object Storage thông qua thư viện `@aws-sdk/client-s3`.
> - `multer` được cấu hình sử dụng `memoryStorage` để nhận file dưới dạng Buffer trong RAM.
> - SDK S3 Client gửi Buffer này trực tiếp lên R2 Bucket.

* **Prompt Copy:**
```text
Hãy xây dựng module Quản lý Media và Upload File kết nối Cloudflare R2 trong thư mục `src/modules/media` và `src/config/s3.ts`.
Yêu cầu cụ thể:
1. Tạo file `src/config/s3.ts` cấu hình `S3Client` của `@aws-sdk/client-s3` trỏ tới Endpoint của Cloudflare R2:
   - endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
   - credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY }
   - region: "auto"
2. Cấu hình `multer` sử dụng `multer.memoryStorage()` làm middleware upload file:
   - Giới hạn dung lượng file tối đa là 5MB.
   - Chỉ cho phép các định dạng MIME loại ảnh (image/jpeg, image/png, image/gif, image/webp) và tài liệu (application/pdf).
3. Viết hàm upload file lên R2 sử dụng lệnh `PutObjectCommand` từ `@aws-sdk/client-s3`. Đặt tên file (Key) là UUID hoặc Timestamp kết hợp tên gốc. Đường dẫn công khai trả về sẽ có dạng: `${process.env.R2_PUBLIC_URL}/${Key}`.
4. APIs quản lý Thư mục (MediaFolder):
   - `GET /api/admin/media/folders` - Lấy danh sách thư mục (sử dụng ObjectIDs).
   - `POST /api/admin/media/folders` - Tạo thư mục mới.
   - `DELETE /api/admin/media/folders/:id` - Xóa thư mục.
5. APIs quản lý File (MediaFile):
   - `POST /api/admin/media/upload` - Nhận file từ middleware multer, upload tệp tin lên Cloudflare R2, sau đó tạo record `MediaFile` trong MongoDB chứa URL của R2, dung lượng, định dạng và liên kết với thư mục chứa.
   - `GET /api/admin/media/files` - Danh sách file thuộc thư mục cụ thể (`folderId`).
   - `DELETE /api/admin/media/files/:id` - Lấy thông tin file từ DB, thực hiện xóa tệp tin tương ứng trên Cloudflare R2 thông qua lệnh `DeleteObjectCommand`, sau đó xóa bản ghi khỏi database.
   - `POST /api/admin/media/files/:id/move` - Di chuyển file sang thư mục khác (cập nhật `folderId`).
6. Chỉ cho phép các admin đã đăng nhập thực hiện thao tác media.
```

---

### Bước 7: APIs Tin Báo Lừa Đảo (Scam Reports) & Chuyển đổi bài viết
> [!NOTE]
> Phục vụ người dân gửi tin báo. Admin có thể convert một tin báo đã xác minh thành bản phác thảo bài viết.

* **Prompt Copy:**
```text
Hãy xây dựng module Tiếp nhận và Xử lý Báo cáo Tin lừa đảo (Scam Reports) trong thư mục `src/modules/reports`.
Yêu cầu cụ thể:
1. API Public:
   - `POST /api/public/reports`: Cho phép người dân gửi phản ánh tin lừa đảo nặc danh hoặc định danh. Dữ liệu gồm: reporterName, contact, caseType, platform, suspectPhone, suspectUrl, suspectAccount, description, location, attachments (mảng chuỗi chứa URL ảnh chụp màn hình). Trạng thái mặc định là `pending`.
2. APIs Admin (yêu cầu vai trò `report_manager` hoặc `super_admin`):
   - `GET /api/admin/reports`: Danh sách tin báo gửi lên, hỗ trợ tìm kiếm và lọc.
   - `GET /api/admin/reports/:id`: Chi tiết tin báo đầy đủ thông tin.
   - `PATCH /api/admin/reports/:id/status`: Thay đổi trạng thái xử lý (`checking`, `verified`, `insufficient`, `forwarded`).
   - `PATCH /api/admin/reports/:id/risk-level`: Đánh giá mức độ rủi ro (low, medium, high, critical).
   - `POST /api/admin/reports/:id/convert-to-article`: Tự động lấy thông tin từ tin báo để tạo một bản thảo bài viết nháp (`status = 'draft'`) trong bảng `Article`, tự động điền các trường kịch bản lừa đảo và gợi ý phòng tránh để biên tập viên chỉnh sửa tiếp. Đổi trạng thái tin báo thành `converted`.
```

---

### Bước 8: APIs Cấu Hình, Thống Kê Dashboard & Audit Log
> [!NOTE]
> APIs phụ trợ và ghi nhật ký hoạt động.

* **Prompt Copy:**
```text
Hãy xây dựng các tính năng Cấu hình website (Settings), Thống kê tổng quan (Analytics) và Nhật ký hoạt động (Audit Logs).
Yêu cầu cụ thể:
1. APIs Cấu hình website (Settings):
   - `GET /api/public/settings` - Lấy cấu hình công khai.
   - `PATCH /api/admin/settings` - (Chỉ dành cho `super_admin`) Cập nhật hoặc thêm cấu hình key-value trong database.
2. APIs Thống kê Dashboard (Analytics - Chỉ dành cho admin):
   - `GET /api/admin/analytics/overview` - Trả về các con số thống kê tổng quan: Tổng số bài viết (đã đăng/nháp), tổng số báo cáo của người dân (pending/đã duyệt), lượt xem bài viết theo ngày, thống kê số báo cáo theo nền tảng và loại hình lừa đảo phổ biến nhất.
3. Nhật ký hoạt động (Audit Logs):
   - Viết một middleware `logActivity(action: string)` ghi nhận lịch sử thao tác của admin vào một bảng `AuditLog` riêng trong MongoDB. Mỗi lần admin thực hiện tạo/sửa/xóa bài viết, thay đổi trạng thái báo cáo, thay đổi cấu hình, upload/xóa file đều được ghi nhận (UserId thực hiện, hành động gì, vào lúc nào, ID đối tượng bị tác động).
   - Route `GET /api/admin/audit-logs` để `super_admin` có thể theo dõi danh sách hành động này.
```

---

## 3. Quy Trình Chạy Thử Backend Sau Khi Hoàn Thành

Khi bạn đã copy xong các prompt trên cho AI thực hiện, backend sẽ được thiết lập đầy đủ. Bạn chạy thử như sau:

1. **Cấu hình Database & Cloudflare R2:**
   - Đảm bảo IP của bạn đã được whitelist trên MongoDB Atlas.
   - Cập nhật chuỗi kết nối vào biến `DATABASE_URL` trong file `.env`.
   - Điền đầy đủ thông tin API keys của Cloudflare R2 (access key, secret key, account id, bucket name, public url).

2. **Cài đặt thư viện & Đồng bộ Database:**
   ```bash
   cd backend
   npm install
   npx prisma db push
   npx prisma db seed
   ```
3. **Khởi động server ở chế độ dev:**
   ```bash
   npm run dev
   ```
   Server sẽ lắng nghe trên cổng `http://localhost:3001`.

4. **Tài khoản đăng nhập mặc định (đã được tạo từ seed):**
   - **Email**: `admin@lanchanso.vn`
   - **Password**: `Admin@123`
