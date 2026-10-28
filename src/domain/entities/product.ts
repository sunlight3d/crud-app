export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  category: string;
  price: number;
  stock: number;
  status?: ProductStatus;
  description: string;
  imageUrl?: string;
}

export interface UpdateProductDTO {
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  status?: ProductStatus;
  description?: string;
  imageUrl?: string;
}

export interface ProductFilterDTO {
  search?: string;
  category?: string;
  status?: ProductStatus | 'all';
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export function calculateProductStatus(stock: number): ProductStatus {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  return 'in_stock';
}
