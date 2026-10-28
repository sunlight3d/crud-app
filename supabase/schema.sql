-- ========================================================
-- SUPABASE SCHEMA FOR CRUD APP (Clean Architecture)
-- Table: products
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop table if exists (for fresh restart)
-- DROP TABLE IF EXISTS public.products;

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

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Cho phép đọc, thêm, sửa, xóa ẩn danh cho demo
-- ========================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access" ON public.products;
CREATE POLICY "Public Read Access"
    ON public.products FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public Insert Access" ON public.products;
CREATE POLICY "Public Insert Access"
    ON public.products FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Access" ON public.products;
CREATE POLICY "Public Update Access"
    ON public.products FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public Delete Access" ON public.products;
CREATE POLICY "Public Delete Access"
    ON public.products FOR DELETE
    USING (true);
