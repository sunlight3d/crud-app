'use client';

import React, { useState } from 'react';
import { X, Check, Copy, Database, Server, ExternalLink, RefreshCw } from 'lucide-react';
import { RepositoryConnectionStatus } from '@/domain/repositories/product-repository.interface';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  status: RepositoryConnectionStatus | null;
  onClose: () => void;
  onRefreshStatus: () => Promise<void>;
}

const SCHEMA_SQL_CODE = `-- ========================================================
-- SUPABASE SCHEMA FOR CRUD APP (Clean Architecture)
-- ========================================================
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

-- Trigger cập nhật updated_at
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

-- RLS: Cho phép đọc/ghi công khai (cho ứng dụng demo)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON public.products;
CREATE POLICY "Public Full Access" ON public.products FOR ALL USING (true) WITH CHECK (true);
`;

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({
  isOpen,
  status,
  onClose,
  onRefreshStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'vercel'>('status');
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SCHEMA_SQL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheck = async () => {
    setIsChecking(true);
    await onRefreshStatus();
    setIsChecking(false);
  };

  const isSupabaseLive = status?.isConnected && status?.provider === 'supabase';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="py-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cấu hình Supabase & Vercel
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hướng dẫn tích hợp Clean Architecture với Supabase Database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'status'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            1. Trạng thái kết nối
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'sql'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            2. SQL Schema Supabase
          </button>
          <button
            onClick={() => setActiveTab('vercel')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'vercel'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            3. Triển khai Vercel
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                  isSupabaseLive
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isSupabaseLive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                      }`}
                    />
                    <h4 className="font-bold text-sm">
                      {isSupabaseLive ? 'Supabase Live Connected!' : 'Chế độ Demo (In-Memory Fake Data)'}
                    </h4>
                  </div>
                  <p className="text-xs mt-1 opacity-90">
                    {status?.message || 'Đang kiểm tra kết nối...'}
                  </p>
                </div>
                <button
                  onClick={handleCheck}
                  disabled={isChecking}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition flex items-center gap-1.5 flex-shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                  Kiểm tra lại
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Tại sao ứng dụng vẫn hoạt động khi chưa có Supabase?
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Ứng dụng áp dụng thiết kế <strong>Clean Architecture (Resilient Repository Pattern)</strong>. Khi chưa cấu hình hoặc database chưa sẵn sàng, hệ thống tự động fallback về <code>MockProductRepository</code> với 12 sản phẩm mẫu sẵn có. Ứng dụng sẽ <strong>100% không bao giờ bị crash</strong> hay gặp lỗi build trên Vercel.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Mở <strong>Supabase Dashboard → SQL Editor</strong> và dán đoạn code sau:
                </span>
                <button
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép!' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-64 border border-slate-800 leading-relaxed">
                {SCHEMA_SQL_CODE}
              </pre>
              <p className="text-[11px] text-slate-400">
                File đầy đủ cũng được lưu tại: <code>supabase/schema.sql</code> và dữ liệu mẫu tại <code>supabase/seed.sql</code>.
              </p>
            </div>
          )}

          {/* TAB 3: VERCEL DEPLOY */}
          {activeTab === 'vercel' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Server className="w-4 h-4 text-indigo-600" />
                  Cấu hình Biến môi trường trên Vercel
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  Vào <strong>Vercel Project → Settings → Environment Variables</strong> và thêm 2 biến sau:
                </p>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-600 font-bold">NEXT_PUBLIC_SUPABASE_URL</span>
                      <p className="text-slate-400 text-[10px] mt-0.5">https://your-project.supabase.co</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-600 font-bold">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                      <p className="text-slate-400 text-[10px] mt-0.5">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <span className="text-indigo-900 dark:text-indigo-200 font-medium">
                  Truy cập bảng điều khiển Vercel của bạn:
                </span>
                <a
                  href="https://vercel.com/nguyen-duc-hoangs-projects/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Mở Vercel <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="py-3 px-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
