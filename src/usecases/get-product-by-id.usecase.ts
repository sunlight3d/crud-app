import { Product } from '../domain/entities/product';
import { IProductRepository } from '../domain/repositories/product-repository.interface';

export class GetProductByIdUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    if (!id || id.trim() === '') {
      throw new Error('ID sản phẩm không hợp lệ.');
    }
    return this.productRepo.getById(id.trim());
  }
}
