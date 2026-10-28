import { CreateProductDTO, Product } from '../domain/entities/product';
import { IProductRepository } from '../domain/repositories/product-repository.interface';

export class CreateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Tên sản phẩm không được để trống.');
    }
    if (!data.category || data.category.trim().length === 0) {
      throw new Error('Danh mục không được để trống.');
    }
    if (typeof data.price !== 'number' || data.price < 0) {
      throw new Error('Giá sản phẩm phải là số không âm.');
    }
    if (typeof data.stock !== 'number' || data.stock < 0) {
      throw new Error('Số lượng tồn kho phải là số không âm.');
    }

    return this.productRepo.create({
      ...data,
      name: data.name.trim(),
      category: data.category.trim(),
      description: data.description?.trim() || '',
      imageUrl: data.imageUrl?.trim() || '',
    });
  }
}
