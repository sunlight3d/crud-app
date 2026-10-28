import { CreateProductDTO, Product, ProductFilterDTO, UpdateProductDTO } from '../entities/product';

export interface RepositoryConnectionStatus {
  isConnected: boolean;
  provider: 'supabase' | 'mock';
  message: string;
}

export interface IProductRepository {
  getAll(filters?: ProductFilterDTO): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(data: CreateProductDTO): Promise<Product>;
  update(id: string, data: UpdateProductDTO): Promise<Product>;
  delete(id: string): Promise<boolean>;
  seed(initialProducts: CreateProductDTO[]): Promise<Product[]>;
  getConnectionStatus(): Promise<RepositoryConnectionStatus>;
}
