'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatCards } from '@/components/StatCards';
import { ProductToolbar } from '@/components/ProductToolbar';
import { ProductTable } from '@/components/ProductTable';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductModal } from '@/components/ProductModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { SupabaseGuideModal } from '@/components/SupabaseGuideModal';
import { Toast, ToastMessage } from '@/components/Toast';
import {
  CreateProductDTO,
  Product,
  ProductFilterDTO,
  UpdateProductDTO,
} from '@/domain/entities/product';
import { RepositoryConnectionStatus } from '@/domain/repositories/product-repository.interface';
import {
  getProductsAction,
  createProductAction,
  updateProductAction,
  deleteProductAction,
  seedProductsAction,
  getHealthStatusAction,
} from '@/actions/product-actions';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<RepositoryConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filter & View state
  const [filters, setFilters] = useState<ProductFilterDTO>({
    search: '',
    category: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch connection status manually
  const checkStatus = useCallback(async () => {
    try {
      const res = await getHealthStatusAction();
      if (res.success && res.data) {
        setStatus(res.data as RepositoryConnectionStatus);
      }
    } catch (e) {
      console.error('Failed to get status', e);
    }
  }, []);

  // Sync data on filter change
  useEffect(() => {
    let ignore = false;
    async function syncData() {
      try {
        const [prodRes, healthRes] = await Promise.all([
          getProductsAction(filters),
          getHealthStatusAction(),
        ]);
        if (!ignore) {
          if (prodRes.success && Array.isArray(prodRes.data)) {
            setProducts(prodRes.data);
          }
          if (healthRes.success && healthRes.data) {
            setStatus(healthRes.data as RepositoryConnectionStatus);
          }
          setIsLoading(false);
        }
      } catch (e) {
        if (!ignore) {
          setIsLoading(false);
          console.error('Lỗi tải dữ liệu', e);
        }
      }
    }
    syncData();
    return () => {
      ignore = true;
    };
  }, [filters]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [products]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<ProductFilterDTO>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const reloadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, healthRes] = await Promise.all([
        getProductsAction(filters),
        getHealthStatusAction(),
      ]);
      if (prodRes.success && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      }
      if (healthRes.success && healthRes.data) {
        setStatus(healthRes.data as RepositoryConnectionStatus);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (data: CreateProductDTO | UpdateProductDTO) => {
    if (productToEdit) {
      const res = await updateProductAction(productToEdit.id, data as UpdateProductDTO);
      if (!res.success) {
        throw new Error(res.error || 'Cập nhật thất bại');
      }
      showToast('success', 'Đã cập nhật sản phẩm thành công!');
    } else {
      const res = await createProductAction(data as CreateProductDTO);
      if (!res.success) {
        throw new Error(res.error || 'Tạo sản phẩm thất bại');
      }
      showToast('success', 'Đã tạo sản phẩm mới thành công!');
    }
    await reloadData();
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await deleteProductAction(id);
    if (!res.success) {
      showToast('error', res.error || 'Xóa sản phẩm thất bại');
      return;
    }
    showToast('success', 'Đã xóa sản phẩm thành công!');
    await reloadData();
  };

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await seedProductsAction();
      if (res.success) {
        showToast('success', res.message || 'Đã nạp dữ liệu mẫu thành công!');
        await reloadData();
      } else {
        showToast('error', res.error || 'Nạp dữ liệu mẫu thất bại');
      }
    } catch (e: unknown) {
      showToast('error', e instanceof Error ? e.message : 'Lỗi khi nạp dữ liệu');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Navbar */}
      <Navbar
        status={status}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* KPI Stats */}
        <StatCards products={products} />

        {/* Search, Filter & Action Toolbar */}
        <ProductToolbar
          filters={filters}
          categories={categories}
          viewMode={viewMode}
          isSeeding={isSeeding}
          onFilterChange={handleFilterChange}
          onViewModeChange={setViewMode}
          onOpenCreateModal={handleOpenCreateModal}
          onSeedData={handleSeedData}
        />

        {/* Products List (Table or Grid) */}
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 flex flex-col items-center justify-center shadow-sm">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-500">Đang tải dữ liệu sản phẩm...</p>
          </div>
        ) : viewMode === 'table' ? (
          <ProductTable
            products={products}
            onEdit={handleOpenEditModal}
            onDelete={prod => setProductToDelete(prod)}
            onSeedData={handleSeedData}
          />
        ) : (
          <ProductGrid
            products={products}
            onEdit={handleOpenEditModal}
            onDelete={prod => setProductToDelete(prod)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 bg-white/50 dark:bg-slate-900/50">
        <p>
          Next.js 16 • Supabase Database • Clean Architecture / MVC • Vercel Ready
        </p>
      </footer>

      {/* Modals */}
      <ProductModal
        isOpen={isModalOpen}
        productToEdit={productToEdit}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
      />

      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
      />

      <SupabaseGuideModal
        isOpen={isGuideOpen}
        status={status}
        onClose={() => setIsGuideOpen(false)}
        onRefreshStatus={checkStatus}
      />

      {/* Toast Notification */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
