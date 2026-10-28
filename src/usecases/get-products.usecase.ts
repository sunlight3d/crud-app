import { Product, ProductFilterDTO } from '../domain/entities/product';
import { IProductRepository } from '../domain/repositories/product-repository.interface';

export class GetProductsUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(filters?: ProductFilterDTO): Promise<Product[]> {
    return this.productRepo.getAll(filters);
  }
}
