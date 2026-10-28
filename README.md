# 🚀 ViberStore - Next.js Clean Architecture CRUD App (Supabase + Vercel)

Ứng dụng quản lý sản phẩm / khóa học thực chiến được xây dựng bằng **Next.js 16 (App Router)** theo mô hình **Clean Architecture (kết hợp MVC)**, sử dụng cơ sở dữ liệu **Supabase (PostgreSQL)** và sẵn sàng **triển khai 100% lên Vercel**.

---

## 🏛️ Kiến trúc Clean Architecture / MVC

Hệ thống tuân thủ nghiêm ngặt nguyên tắc phân tầng độc lập (Dependency Rule), không bị phụ thuộc vào framework bên ngoài:

```
src/
├── domain/                      # 1. CORE DOMAIN (Enterprise Rules)
│   ├── entities/product.ts      # Product Entity, DTOs & Validation
│   └── repositories/            # IProductRepository Interface (Contract)
│
├── usecases/                    # 2. USE CASES (Application Business Rules)
│   ├── get-products.usecase.ts
│   ├── create-product.usecase.ts
│   ├── update-product.usecase.ts
│   ├── delete-product.usecase.ts
│   ├── seed-products.usecase.ts
│   └── get-connection-status.usecase.ts
│
├── infrastructure/              # 3. INFRASTRUCTURE & DATA ACCESS
│   ├── supabase/client.ts       # Supabase Client Factory
│   ├── data/fake-products.ts    # 12+ bản ghi dữ liệu mẫu phong phú
│   └── repositories/
│       ├── supabase-product.repository.ts  # Kết nối Supabase trực tiếp
│       ├── mock-product.repository.ts      # Fallback In-Memory khi chưa có DB
│       └── repository.factory.ts           # Resilient Factory tự động chuyển đổi
│
├── controllers/                 # 4. CONTROLLERS (Interface Adapters)
│   └── product.controller.ts    # Điều phối Use Cases & chuẩn hóa response
│
├── actions/                     # Next.js Server Actions
│   └── product-actions.ts       # Server Actions gọi Controllers
│
├── app/api/                     # REST API Endpoints (GET, POST, PUT, DELETE)
│   ├── products/route.ts
│   ├── products/[id]/route.ts
│   ├── seed/route.ts
│   └── health/route.ts
│
└── components/                  # 5. VIEW / PRESENTATION LAYER
    ├── Navbar.tsx               # Header, Trạng thái Supabase & Help Modal
    ├── StatCards.tsx            # Thống kê KPI tồn kho & doanh thu
    ├── ProductToolbar.tsx       # Tìm kiếm, Lọc danh mục, Sắp xếp & Nạp mẫu
    ├── ProductTable.tsx         # Bảng dữ liệu sản phẩm tương tác cao
    ├── ProductGrid.tsx          # Giao diện thẻ Card trực quan
    ├── ProductModal.tsx         # Modal Thêm / Sửa + Nút "Điền nhanh mẫu"
    ├── DeleteConfirmModal.tsx   # Hộp thoại xác nhận xóa an toàn
    └── SupabaseGuideModal.tsx   # Hướng dẫn chi tiết 1-Click Copy SQL & Vercel
```

---

## ✨ Điểm nổi bật & Tính năng

1. **Đầy đủ chức năng CRUD**:
   - **Create**: Thêm sản phẩm mới với validate đầy đủ và nút **Điền nhanh mẫu (Auto-fill Sample)** để test siêu tốc.
   - **Read**: Tìm kiếm tức thì theo từ khóa, lọc theo danh mục, lọc theo trạng thái tồn kho, sắp xếp đa tiêu chí.
   - **Update**: Chỉnh sửa thông tin, giá bán, tồn kho (tự động cập nhật trạng thái `in_stock`, `low_stock`, `out_of_stock`).
   - **Delete**: Xóa sản phẩm với hộp thoại xác nhận bảo vệ an toàn dữ liệu.

2. **Dữ liệu mẫu phong phú (Fake Data Available)**:
   - Tích hợp sẵn 12 sản phẩm công nghệ thực tế (MacBook, Dell XPS, Khóa học Clean Architecture, Keychron, MX Master 3S, Sony WH-1000XM5, Jetson Orin Nano AI...).
   - Nút **"Nạp dữ liệu mẫu" (Seed Data)** ngay trên thanh công cụ để reset hoặc khôi phục dữ liệu bất cứ lúc nào với 1 click!

3. **Cơ chế Resilient Repository (100% Không sợ lỗi Deploy)**:
   - Khi chưa cấu hình biến môi trường Supabase: Hệ thống tự động hoạt động ở **Chế độ Demo (In-Memory Mock Repository)** với đầy đủ dữ liệu mẫu.
   - Khi đã nhập Supabase URL và Anon Key: Tự động kết nối trực tiếp đến **Supabase PostgreSQL**.
   - Không bao giờ bị crash hay fail build trên Vercel dù chưa có database!

4. **REST API & Server Actions song hành**:
   - Vừa hỗ trợ Next.js Server Actions hiệu năng cao, vừa cung cấp REST API (`/api/products`, `/api/seed`, `/api/health`) để dễ dàng tích hợp Postman hoặc ứng dụng mobile.

---

## 🗄️ Cấu hình Supabase (PostgreSQL)

### Bước 1: Tạo bảng và phân quyền trên Supabase
1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard) và tạo một Project mới.
2. Vào mục **SQL Editor** ở thanh menu bên trái.
3. Dán toàn bộ nội dung từ file `supabase/schema.sql` (hoặc copy trực tiếp từ modal hướng dẫn trên giao diện web):

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Full Access" ON public.products FOR ALL USING (true) WITH CHECK (true);
```

4. Bấm **RUN**.
5. *(Tùy chọn)*: Để nạp luôn 12 bản ghi fake data bằng SQL, chạy tiếp file `supabase/seed.sql` trong SQL Editor (hoặc bấm nút "Nạp dữ liệu mẫu" trên website).

---

## ☁️ Triển khai lên Vercel (100% Deployable)

### Cách 1: Triển khai qua Vercel Dashboard (Khuyên dùng)
1. Đẩy code lên GitHub repository.
2. Truy cập [Vercel Dashboard](https://vercel.com/nguyen-duc-hoangs-projects/).
3. Bấm **Add New...** → **Project** và chọn repository chứa code.
4. Ở phần **Root Directory**, chọn thư mục `crud_app`.
5. Mở mục **Environment Variables** và cấu hình 2 biến:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://[PROJECT_REF].supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOi...`
6. Bấm **Deploy**. Vercel sẽ tự động build và cung cấp domain production trong vòng 1 phút!

### Cách 2: Triển khai trực tiếp qua Vercel CLI
```bash
cd crud_app
npx vercel
# Làm theo hướng dẫn trên terminal để liên kết project và deploy
```

---

## 💻 Chạy cục bộ (Local Development)

```bash
# 1. Di chuyển vào thư mục dự án
cd crud_app

# 2. Tạo file biến môi trường (tùy chọn)
cp .env.example .env.local

# 3. Chạy môi trường phát triển
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000) để trải nghiệm ứng dụng.

---

## 🔄 Quy trình CI/CD Tự Động (GitHub Actions & Vercel)

Dự án đã tích hợp sẵn quy trình CI/CD chuẩn doanh nghiệp với 2 tầng kiểm soát:

1. **Continuous Integration (CI)**:
   - Tự động chạy ESLint, TypeScript Typecheck, Unit Tests và Build Test mỗi khi có commit hoặc Pull Request.
   - Chạy kiểm thử toàn bộ CI cục bộ:
     ```bash
     npm run ci
     ```
   - Chạy riêng Unit Tests:
     ```bash
     npm test
     ```

2. **Continuous Deployment (CD)**:
   - Tự động triển khai lên Vercel khi merge vào nhánh `master` hoặc `main`.
   - Xem chi tiết tại [Tài liệu hướng dẫn CI/CD](file:///Volumes/data/code/VietIS/vibercodeDate21-09-2026/crud_app/CICD_GUIDE.md).

---

## 🛠️ Kiểm tra Build (Production Build Verification)

```bash
npm run build
```
Build chạy thành công 100% không cảnh báo, không lỗi TypeScript hay ESLint.
