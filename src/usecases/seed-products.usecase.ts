import { CreateProductDTO, Product } from '../domain/entities/product';
import { IProductRepository } from '../domain/repositories/product-repository.interface';

export class SeedProductsUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(initialProducts: CreateProductDTO[]): Promise<Product[]> {
    return this.productRepo.seed(initialProducts);
  }
}
