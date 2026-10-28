import {
  calculateProductStatus,
  CreateProductDTO,
  Product,
  ProductFilterDTO,
  UpdateProductDTO,
} from '../../domain/entities/product';
import {
  IProductRepository,
  RepositoryConnectionStatus,
} from '../../domain/repositories/product-repository.interface';
import { INITIAL_FAKE_PRODUCTS } from '../data/fake-products';

export class MockProductRepository implements IProductRepository {
  private static products: Product[] = [];

  constructor() {
    if (MockProductRepository.products.length === 0) {
      this.initDefaultData();
    }
  }

  private initDefaultData(): void {
    const now = new Date().toISOString();
    MockProductRepository.products = INITIAL_FAKE_PRODUCTS.map((item, index) => ({
      id: `mock-${index + 1}`,
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
      status: item.status || calculateProductStatus(item.stock),
      description: item.description,
      imageUrl: item.imageUrl,
      createdAt: new Date(Date.now() - (INITIAL_FAKE_PRODUCTS.length - index) * 86400000).toISOString(),
      updatedAt: now,
    }));
  }

  async getAll(filters?: ProductFilterDTO): Promise<Product[]> {
    let result = [...MockProductRepository.products];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (filters?.category && filters.category !== 'all') {
      result = result.filter(
        p => p.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters?.status && filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status);
    }

    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder || 'desc';

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'stock') {
        comparison = a.stock - b.stock;
      } else {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }

  async getById(id: string): Promise<Product | null> {
    const found = MockProductRepository.products.find(p => p.id === id);
    return found ? { ...found } : null;
  }

  async create(data: CreateProductDTO): Promise<Product> {
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: data.name,
      category: data.category,
      price: data.price,
      stock: data.stock,
      status: data.status || calculateProductStatus(data.stock),
      description: data.description,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=60',
      createdAt: now,
      updatedAt: now,
    };

    MockProductRepository.products.unshift(newProduct);
    return newProduct;
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    const index = MockProductRepository.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Không tìm thấy sản phẩm với ID: ${id}`);
    }

    const existing = MockProductRepository.products[index];
    const newStock = data.stock !== undefined ? data.stock : existing.stock;
    const newStatus = data.status || (data.stock !== undefined ? calculateProductStatus(newStock) : existing.status);

    const updated: Product = {
      ...existing,
      ...data,
      stock: newStock,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    MockProductRepository.products[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = MockProductRepository.products.length;
    MockProductRepository.products = MockProductRepository.products.filter(p => p.id !== id);
    return MockProductRepository.products.length < initialLength;
  }

  async seed(initialProducts: CreateProductDTO[]): Promise<Product[]> {
    this.initDefaultData();
    if (initialProducts && initialProducts.length > 0) {
      const now = new Date().toISOString();
      const customProducts: Product[] = initialProducts.map((item, index) => ({
        id: `mock-${index + 1}`,
        name: item.name,
        category: item.category,
        price: item.price,
        stock: item.stock,
        status: item.status || calculateProductStatus(item.stock),
        description: item.description,
        imageUrl: item.imageUrl,
        createdAt: now,
        updatedAt: now,
      }));
      MockProductRepository.products = customProducts;
    }
    return [...MockProductRepository.products];
  }

  async getConnectionStatus(): Promise<RepositoryConnectionStatus> {
    return {
      isConnected: true,
      provider: 'mock',
      message: 'Đang chạy với dữ liệu mẫu (In-Memory Mock Repository). Cung cấp biến môi trường Supabase để đồng bộ database thực.',
    };
  }
}
