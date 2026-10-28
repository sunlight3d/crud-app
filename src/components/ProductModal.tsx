'use client';

import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { CreateProductDTO, Product, UpdateProductDTO } from '@/domain/entities/product';

interface ProductModalProps {
  isOpen: boolean;
  productToEdit: Product | null;
  onClose: () => void;
  onSubmit: (data: CreateProductDTO | UpdateProductDTO) => Promise<void>;
}

const SAMPLE_FILL_OPTIONS = [
  {
    name: 'iPad Pro 13" M4 Tandem OLED',
    category: 'Máy tính bảng',
    price: 1299,
    stock: 14,
    description: 'Chip M4 cực mạnh, màn hình Ultra Retina XDR siêu sáng, thiết kế siêu mỏng 5.1mm, hỗ trợ Apple Pencil Pro.',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'Khóa học Microservices với Go & Kubernetes',
    category: 'Đào tạo IT',
    price: 289,
    stock: 45,
    description: 'Kiến trúc hệ thống phân tán chịu tải cao, gRPC, Docker, K8s, CI/CD và quan sát hệ thống với Prometheus.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
  },
  {
    name: 'Đồng hồ Apple Watch Ultra 2 Titanium',
    category: 'Phụ kiện',
    price: 799,
    stock: 6,
    description: 'Vỏ titan 49mm chống nước 100m, GPS tần số kép chuẩn xác, pin lên tới 72 giờ ở chế độ tiết kiệm năng lượng.',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=60',
  },
];

interface FormContentProps {
  productToEdit: Product | null;
  onClose: () => void;
  onSubmit: (data: CreateProductDTO | UpdateProductDTO) => Promise<void>;
}

const FormContent: React.FC<FormContentProps> = ({
  productToEdit,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(productToEdit?.name || '');
  const [category, setCategory] = useState(productToEdit?.category || 'Laptops');
  const [price, setPrice] = useState<number | ''>(productToEdit?.price ?? '');
  const [stock, setStock] = useState<number | ''>(productToEdit?.stock ?? '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [imageUrl, setImageUrl] = useState(productToEdit?.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAutoFill = () => {
    const randomSample = SAMPLE_FILL_OPTIONS[Math.floor(Math.random() * SAMPLE_FILL_OPTIONS.length)];
    setName(randomSample.name);
    setCategory(randomSample.category);
    setPrice(randomSample.price);
    setStock(randomSample.stock);
    setDescription(randomSample.description);
    setImageUrl(randomSample.imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (!category.trim()) {
      setError('Vui lòng nhập hoặc chọn danh mục.');
      return;
    }
    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      setError('Giá sản phẩm phải là số hợp lệ không âm.');
      return;
    }
    if (stock === '' || isNaN(Number(stock)) || Number(stock) < 0) {
      setError('Số lượng tồn kho phải là số hợp lệ không âm.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        category: category.trim(),
        price: Number(price),
        stock: Number(stock),
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu sản phẩm.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="py-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {productToEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h3>
          {!productToEdit && (
            <button
              type="button"
              onClick={handleAutoFill}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md hover:bg-indigo-100 transition"
              title="Tự động điền dữ liệu mẫu để thử nghiệm nhanh"
            >
              <Sparkles className="w-3 h-3" />
              Điền nhanh mẫu
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-medium">
            {error}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tên sản phẩm / Khóa học <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="VD: MacBook Pro 16 M3 Max"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Danh mục <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="VD: Laptops, Đào tạo IT..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Đơn giá ($ USD) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="VD: 1999"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Số lượng tồn kho <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={e => setStock(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="VD: 15"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Hệ thống tự động tính: 0 = Hết hàng, ≤ 5 = Sắp hết, &gt; 5 = Còn hàng.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Mô tả chi tiết
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Thông số kỹ thuật, cấu hình, nội dung đào tạo..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            URL hình ảnh (Unsplash / CDN)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{productToEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  productToEdit,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <FormContent
        key={productToEdit?.id || 'new-product-form'}
        productToEdit={productToEdit}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
};
