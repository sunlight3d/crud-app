'use client';

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Edit2, Trash2, PackageOpen } from 'lucide-react';
import { Product } from '@/domain/entities/product';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map(product => {
        return (
          <div
            key={product.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col justify-between"
          >
            <div>
              {/* Product Image */}
              <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={e => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <PackageOpen className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur shadow-xs">
                    {product.category}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  {product.status === 'in_stock' && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs">
                      Còn hàng
                    </span>
                  )}
                  {product.status === 'low_stock' && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                      Sắp hết ({product.stock})
                    </span>
                  )}
                  {product.status === 'out_of_stock' && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-xs">
                      Hết hàng
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {product.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 min-h-[32px]">
                  {product.description || 'Chưa có mô tả chi tiết'}
                </p>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xs text-slate-500">
                    Tồn: <strong className="text-slate-800 dark:text-slate-200">{product.stock}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Footer with actions */}
            <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{formatDate(product.updatedAt || product.createdAt)}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(product)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
