import { IProductRepository } from '../domain/repositories/product-repository.interface';

export class DeleteProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(id: string): Promise<boolean> {
    if (!id || id.trim() === '') {
      throw new Error('ID sản phẩm không hợp lệ.');
    }
    return this.productRepo.delete(id.trim());
  }
}
