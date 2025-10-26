# ShopUTE_Final – Hướng dẫn cài đặt và chạy dự án

Dự án gồm 4 ứng dụng tách biệt trong một mono‑repo:

- Backend Admin (NestJS): `backend/admin`
- Backend User (Express + Sequelize): `backend/user`
- Frontend Admin (Next.js): `frontend/shopute/admin`
- Frontend User (React CRA): `frontend/shopute/user`

## Yêu cầu hệ thống

- Node.js >= 18 (khuyến nghị 18.x hoặc 20.x)
- npm >= 9
- MySQL 8.x (hoặc 5.7) đang chạy cục bộ
- Git

## Cấu trúc thư mục

- `backend/admin`: API quản trị (NestJS, TypeORM, cổng mặc định 8081, prefix `/api`)
- `backend/user`: API người dùng (Express, Sequelize, cổng mặc định 8088, prefix `/api`)
- `frontend/shopute/admin`: Web Admin (Next.js, mặc định chạy cổng 3001)
- `frontend/shopute/user`: Web User (Create React App, mặc định chạy cổng 3000)

## Chuẩn bị cơ sở dữ liệu

1. Tạo database MySQL (ví dụ `shopute`).
2. Cập nhật thông tin kết nối trong các file `.env` và `config.json`:
   - `backend/user/.env`: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
   - `backend/user/src/config/config.json` (Sequelize CLI dùng file này)
   - `backend/admin/.env`: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
3. Chạy migration + seed cho backend User (tạo bảng và dữ liệu mẫu):
   - Tại thư mục `backend/user`:
     - `npm install`
     - `npx sequelize-cli db:migrate`
     - (Tuỳ chọn) `npx sequelize-cli db:seed:all`

Lưu ý: Backend Admin (TypeORM) sử dụng cùng database và `synchronize=false`, nên hãy chạy migration bên `backend/user` trước để có đầy đủ bảng.

## Cấu hình môi trường (.env)

Các file `.env` đã có sẵn trong repo. Bạn có thể điều chỉnh theo máy của bạn (không commit thông tin nhạy cảm):

- `backend/admin/.env`

  - `PORT=8081`
  - `DB_HOST=127.0.0.1`
  - `DB_PORT=3306`
  - `DB_USER=...`
  - `DB_PASSWORD=...`
  - `DB_NAME=shopute`
  - `JWT_SECRET=...` (hoặc `JWT_ACCESS_SECRET=...` nếu module JWT dùng biến này)
  - `FRONTEND_ORIGIN=http://localhost:3000,http://localhost:3001`
  - Biến SMTP nếu dùng gửi mail: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

- `backend/user/.env`

  - `PORT=8088`
  - `DB_HOST=127.0.0.1`
  - `DB_PORT=3306`
  - `DB_USER=...`
  - `DB_PASS=...`
  - `DB_NAME=shopute`
  - `JWT_SECRET=...`
  - (Tuỳ chọn) `JWT_EXPIRE=1d`
  - Biến SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

- `frontend/shopute/admin/.env`

  - `NEXT_PUBLIC_API_URL=http://localhost:8081/api`
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8081`
  - `NEXT_PUBLIC_API_BASE_IMAGE_URL=http://localhost:8081`
  - `NEXT_PUBLIC_USER_WEB_URL=http://localhost:3000`

- `frontend/shopute/user/.env`
  - `VITE_WS_URL=ws://localhost:8088` (nếu không dùng Vite, biến này có thể không cần)

Gợi ý bảo mật: không để JWT secret, mật khẩu DB/SMTP thật trong README hay commit công khai.

## Cài đặt dependencies

Chạy lệnh cài đặt trong từng ứng dụng:

- Backend Admin: `cd backend/admin && npm install`
- Backend User: `cd backend/user && npm install`
- Frontend Admin: `cd frontend/shopute/admin && npm install`
- Frontend User: `cd frontend/shopute/user && npm install`

## Khởi chạy ứng dụng

Bạn có thể chạy từng phần theo thứ tự đề xuất dưới đây.

1. Backend User (Express + Sequelize)

- `cd backend/user`
- Migrate/seed (lần đầu):
  - `npx sequelize-cli db:migrate`
  - (Tuỳ chọn) `npx sequelize-cli db:seed:all`
- Chạy dev: `npm run dev`
- Mặc định lắng nghe: `http://localhost:8088` (API: `http://localhost:8088/api`)

2. Backend Admin (NestJS)

- `cd backend/admin`
- Chạy dev: `npm run dev` (hoặc `npm run start:dev`)
- Mặc định lắng nghe: `http://localhost:8081` (API: `http://localhost:8081/api`)

3. Frontend User (CRA)

- `cd frontend/shopute/user`
- Chạy dev: `npm start`
- Truy cập: `http://localhost:3000`

4. Frontend Admin (Next.js)

- `cd frontend/shopute/admin`
- Chạy dev: `npm run dev`
- Truy cập: `http://localhost:3001`

## Ghi chú cấu hình & tài nguyên tĩnh

- CORS:
  - Backend Admin cho phép origin qua biến `FRONTEND_ORIGIN` trong `backend/admin/.env`.
  - Backend User đang set origin `http://localhost:3000` trong mã nguồn (`backend/user/src/index.ts`). Nếu chạy frontend ở domain/port khác, hãy điều chỉnh tại đây hoặc dùng biến môi trường tương ứng.
- Static files:
  - Backend Admin phục vụ ảnh từ `public/images` với prefix `/images` và thư mục `uploads/products`, `uploads/avatar` (theo `backend/admin/src/main.ts`). Nếu thiếu, hãy tạo thư mục để tránh lỗi khi upload/serve.
  - Backend User phục vụ thư mục `public/images` qua route `/images`.

## Build và chạy production (tuỳ chọn)

- Backend Admin:
  - `cd backend/admin && npm run build && npm run start:prod`
- Backend User:
  - `cd backend/user && npm run build && npm start`
- Frontend Admin:
  - `cd frontend/shopute/admin && npm run build && npm start`
- Frontend User:
  - `cd frontend/shopute/user && npm run build` (serve build với bất kỳ static server nào)

## Khắc phục sự cố thường gặp

- Không kết nối được MySQL:
  - Kiểm tra `DB_HOST/DB_PORT/DB_USER/DB_PASS/DB_NAME` trong `backend/*/.env` và `backend/user/src/config/config.json`.
  - Đảm bảo database đã tồn tại và user có quyền.
- Lỗi bảng thiếu ở Backend Admin:
  - Chạy migration/seed bên `backend/user` trước (Admin dùng cùng DB, `synchronize=false`).
- CORS/401/403 trên frontend:
  - Đảm bảo các port: User API `8088`, Admin API `8081`, Frontend User `3000`, Frontend Admin `3001`.
  - Cập nhật `FRONTEND_ORIGIN` (Admin) và cấu hình CORS (User) phù hợp.
- Port đã được sử dụng:
  - Đổi biến `PORT` tương ứng trong `.env` hoặc đóng tiến trình đang chiếm port.

## Lệnh nhanh (tham khảo)

- Backend User: `cd backend/user && npm run dev`
- Backend Admin: `cd backend/admin && npm run dev`
- Frontend User: `cd frontend/shopute/user && npm start`
- Frontend Admin: `cd frontend/shopute/admin && npm run dev`
