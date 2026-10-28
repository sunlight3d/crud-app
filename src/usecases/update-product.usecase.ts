import { Product, UpdateProductDTO } from '../domain/entities/product';
import { IProductRepository } from '../domain/repositories/product-repository.interface';

export class UpdateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(id: string, data: UpdateProductDTO): Promise<Product> {
    if (!id || id.trim() === '') {
      throw new Error('ID sản phẩm không hợp lệ.');
    }

    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new Error('Tên sản phẩm không được để trống.');
    }
    if (data.category !== undefined && data.category.trim().length === 0) {
      throw new Error('Danh mục không được để trống.');
    }
    if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
      throw new Error('Giá sản phẩm phải là số không âm.');
    }
    if (data.stock !== undefined && (typeof data.stock !== 'number' || data.stock < 0)) {
      throw new Error('Số lượng tồn kho phải là số không âm.');
    }

    return this.productRepo.update(id.trim(), data);
  }
}
