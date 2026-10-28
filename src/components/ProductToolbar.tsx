'use client';

import React from 'react';
import { Search, Plus, Sparkles, LayoutGrid, LayoutList, RefreshCw } from 'lucide-react';
import { ProductFilterDTO, ProductStatus } from '@/domain/entities/product';

interface ProductToolbarProps {
  filters: ProductFilterDTO;
  categories: string[];
  viewMode: 'table' | 'grid';
  isSeeding: boolean;
  onFilterChange: (newFilters: Partial<ProductFilterDTO>) => void;
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onOpenCreateModal: () => void;
  onSeedData: () => void;
}

export const ProductToolbar: React.FC<ProductToolbarProps> = ({
  filters,
  categories,
  viewMode,
  isSeeding,
  onFilterChange,
  onViewModeChange,
  onOpenCreateModal,
  onSeedData,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm space-y-3">
      {/* Top row: Search and Main Action Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={e => onFilterChange({ search: e.target.value })}
            placeholder="Tìm theo tên sản phẩm, mô tả, danh mục..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Seed Fake Data Button */}
          <button
            onClick={onSeedData}
            disabled={isSeeding}
            title="Nạp 12 sản phẩm mẫu vào hệ thống"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 transition disabled:opacity-50"
          >
            {isSeeding ? (
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            ) : (
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            )}
            <span>{isSeeding ? 'Đang nạp...' : 'Nạp dữ liệu mẫu'}</span>
          </button>

          {/* Create Button */}
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Filters, Sorting and View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Danh mục:</span>
            <select
              value={filters.category || 'all'}
              onChange={e => onFilterChange({ category: e.target.value })}
              className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Tất cả ({categories.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Trạng thái:</span>
            <select
              value={filters.status || 'all'}
              onChange={e => onFilterChange({ status: e.target.value as ProductStatus | 'all' })}
              className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Tất cả</option>
              <option value="in_stock">Còn hàng</option>
              <option value="low_stock">Sắp hết hàng (≤ 5)</option>
              <option value="out_of_stock">Hết hàng (0)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sắp xếp:</span>
            <select
              value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
              onChange={e => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [
                  ProductFilterDTO['sortBy'],
                  ProductFilterDTO['sortOrder']
                ];
                onFilterChange({ sortBy, sortOrder });
              }}
              className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="createdAt-desc">Mới nhất</option>
              <option value="createdAt-asc">Cũ nhất</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
              <option value="stock-desc">Tồn kho: Nhiều nhất</option>
              <option value="name-asc">Tên: A → Z</option>
            </select>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800">
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-md transition ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Hiển thị dạng Bảng"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md transition ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Hiển thị dạng Lưới Card"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
