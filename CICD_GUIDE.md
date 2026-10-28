# 🔄 Hướng Dẫn Quy Trình CI/CD (Continuous Integration & Continuous Deployment)

Tài liệu này hướng dẫn chi tiết quy trình tự động hóa kiểm thử, đóng gói và triển khai ứng dụng **`crud_app`** lên **Vercel** bằng **GitHub Actions**.

---

## 🗺️ Sơ đồ Luồng Quy trình CI/CD

```
        Developer
            │
            ▼ (git push / pull_request)
   ┌──────────────────────────────────────────────┐
   │            GitHub Repository                 │
   └──────────────────────┬───────────────────────┘
                          │
                          ▼ Triggers GitHub Actions
   ┌──────────────────────────────────────────────┐
   │     STAGE 1: CONTINUOUS INTEGRATION (CI)     │
   │                                              │
   │  1. 🔍 ESLint (Kiểm tra cú pháp & chuẩn code)│
   │  2. 🏷️ TypeScript (tsc --noEmit)            │
   │  3. 🧪 Unit Tests (Clean Architecture logic) │
   │  4. 🏗️ Next.js Production Build Test         │
   └──────────────────────┬───────────────────────┘
                          │
           ┌──────────────┴──────────────┐
           ▼                             ▼
       ❌ FAILED                     ✅ PASSED
   Chặn merge & báo lỗi           Chuyển sang bước CD
                                         │
                                         ▼
   ┌──────────────────────────────────────────────┐
   │    STAGE 2: CONTINUOUS DEPLOYMENT (CD)       │
   │                                              │
   │  • Nếu là PR: Tạo bản Preview Deployment     │
   │  • Nếu là push master: Triển khai Production │
   │  • Nền tảng: Vercel Cloud Serverless         │
   └──────────────────────────────────────────────┘
```

---

## 🛠️ 1. Các lệnh kiểm thử CI cục bộ (Local Verification)

Trước khi đẩy mã nguồn lên GitHub, lập trình viên có thể chạy toàn bộ chuỗi kiểm thử CI chỉ với 1 câu lệnh duy nhất:

```bash
cd crud_app
npm run ci
```

Lệnh này sẽ tự động chạy tuần tự:
1. `npm run lint`: Kiểm tra tiêu chuẩn ESLint 9.
2. `npm run type-check`: Kiểm tra chặt chẽ kiểu dữ liệu TypeScript (`tsc --noEmit`).
3. `npm run test`: Chạy toàn bộ 7 bài unit test cho Use Cases & Entities (`node:test` + `tsx`).
4. `npm run build`: Thực hiện build Next.js Turbopack để đảm bảo không lỗi biên dịch.

---

## 🚀 2. Thiết lập CD triển khai lên Vercel

Có 2 cách để hoàn tất quy trình CD:

### Cách 1: Vercel Native Git Integration (Khuyên dùng nhất - Tiện lợi & Nhanh chóng)
1. Đẩy code lên GitHub:
   ```bash
   git add .
   git commit -m "feat: setup clean architecture crud app and ci/cd"
   git push origin master
   ```
2. Mở [Vercel Dashboard](https://vercel.com/nguyen-duc-hoangs-projects/).
3. Bấm **Add New...** ➔ **Project** ➔ Import repository GitHub này.
4. Ở phần **Root Directory**, chọn: `crud_app` (hoặc `vibercodeDate21-09-2026/crud_app`).
5. Ở phần **Environment Variables**, điền:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://pegofymqlrdhyabuupzm.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZ29meW1xbHJkaHlhYnV1cHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxOTI2OTUsImV4cCI6MjEwODc2ODY5NX0.GIiIyDqQrdEvEvx2ffPzO4FWOWH6qdQzlRHKcAU0V6A`
6. Nhấn **Deploy**.
> **Ưu điểm:** Sau khi thiết lập 1 lần duy nhất, mỗi lần bạn push code lên GitHub, Vercel sẽ tự động build và cập nhật phiên bản mới nhất!

---

### Cách 2: Triển khai trực tiếp qua GitHub Actions Pipeline
Nếu bạn muốn GitHub Actions tự động kiểm soát việc deploy qua Vercel CLI:
1. Vào **GitHub Repository ➔ Settings ➔ Secrets and variables ➔ Actions**.
2. Thêm 3 Secret sau:
   - `VERCEL_TOKEN`: Tạo tại [Vercel Account Tokens](https://vercel.com/account/settings/tokens).
   - `VERCEL_ORG_ID`: Lấy trong file `.vercel/project.json` sau khi chạy `npx vercel link`.
   - `VERCEL_PROJECT_ID`: Lấy trong file `.vercel/project.json` sau khi chạy `npx vercel link`.
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://pegofymqlrdhyabuupzm.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Key Supabase của bạn.

---

## 📋 3. Vị trí các file cấu hình CI/CD trong dự án

- **File Workflow Monorepo**: [`.github/workflows/crud-app-ci-cd.yml`](file:///Volumes/data/code/VietIS/.github/workflows/crud-app-ci-cd.yml)
- **File Workflow Standalone**: [`crud_app/.github/workflows/ci-cd.yml`](file:///Volumes/data/code/VietIS/vibercodeDate21-09-2026/crud_app/.github/workflows/ci-cd.yml)
- **File Unit Tests**: [`crud_app/tests/product-domain.test.ts`](file:///Volumes/data/code/VietIS/vibercodeDate21-09-2026/crud_app/tests/product-domain.test.ts)
- **Scripts Package**: [`crud_app/package.json`](file:///Volumes/data/code/VietIS/vibercodeDate21-09-2026/crud_app/package.json)
