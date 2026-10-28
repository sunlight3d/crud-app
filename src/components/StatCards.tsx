'use client';

import React from 'react';
import { Package, CheckCircle2, AlertTriangle, DollarSign } from 'lucide-react';
import { Product } from '@/domain/entities/product';
import { formatCurrency } from '@/lib/utils';

interface StatCardsProps {
  products: Product[];
}

export const StatCards: React.FC<StatCardsProps> = ({ products }) => {
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.status === 'in_stock').length;
  const lowStockCount = products.filter(p => p.status === 'low_stock').length;
  const outOfStockCount = products.filter(p => p.status === 'out_of_stock').length;

  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const categoriesCount = new Set(products.map(p => p.category)).size;

  const stats = [
    {
      label: 'Tổng sản phẩm',
      value: totalProducts,
      sub: `${categoriesCount} danh mục`,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
    },
    {
      label: 'Còn hàng sẵn',
      value: inStockCount,
      sub: 'Đầy đủ tồn kho',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
    },
    {
      label: 'Cảnh báo tồn kho',
      value: lowStockCount + outOfStockCount,
      sub: `${lowStockCount} sắp hết • ${outOfStockCount} hết hàng`,
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
    },
    {
      label: 'Tổng giá trị kho',
      value: formatCurrency(totalValue),
      sub: 'Định giá tồn kho thực tế',
      icon: DollarSign,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border ${stat.bg} transition-all hover:shadow-md flex items-center justify-between`}
          >
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {stat.value}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {stat.sub}
              </p>
            </div>
            <div className={`p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${stat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
