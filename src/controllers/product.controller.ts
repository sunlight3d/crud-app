import {
  CreateProductDTO,
  ProductFilterDTO,
  UpdateProductDTO,
} from '../domain/entities/product';
import { getProductRepository } from '../infrastructure/repositories/repository.factory';
import { CreateProductUseCase } from '../usecases/create-product.usecase';
import { DeleteProductUseCase } from '../usecases/delete-product.usecase';
import { GetConnectionStatusUseCase } from '../usecases/get-connection-status.usecase';
import { GetProductByIdUseCase } from '../usecases/get-product-by-id.usecase';
import { GetProductsUseCase } from '../usecases/get-products.usecase';
import { SeedProductsUseCase } from '../usecases/seed-products.usecase';
import { UpdateProductUseCase } from '../usecases/update-product.usecase';
import { INITIAL_FAKE_PRODUCTS } from '../infrastructure/data/fake-products';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ProductController {
  private static getUseCases() {
    const repo = getProductRepository();
    return {
      getProducts: new GetProductsUseCase(repo),
      getProductById: new GetProductByIdUseCase(repo),
      createProduct: new CreateProductUseCase(repo),
      updateProduct: new UpdateProductUseCase(repo),
      deleteProduct: new DeleteProductUseCase(repo),
      seedProducts: new SeedProductsUseCase(repo),
      getConnectionStatus: new GetConnectionStatusUseCase(repo),
    };
  }

  static async getProducts(filters?: ProductFilterDTO): Promise<ApiResponse> {
    try {
      const { getProducts } = this.getUseCases();
      const products = await getProducts.execute(filters);
      return {
        success: true,
        data: products,
        message: 'Lấy danh sách sản phẩm thành công.',
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Lỗi lấy danh sách sản phẩm.',
      };
    }
  }

  static async getProductById(id: string): Promise<ApiResponse> {
    try {
      const { getProductById } = this.getUseCases();
      const product = await getProductById.execute(id);
      if (!product) {
        return {
          success: false,
          error: `Không tìm thấy sản phẩm với ID: ${id}`,
        };
      }
      return {
        success: true,
        data: product,
        message: 'Lấy thông tin sản phẩm thành công.',
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Lỗi truy vấn sản phẩm.',
      };
    }
  }

  static async createProduct(dto: CreateProductDTO): Promise<ApiResponse> {
    try {
      const { createProduct } = this.getUseCases();
      const created = await createProduct.execute(dto);
      return {
        success: true,
        data: created,
        message: 'Tạo sản phẩm mới thành công!',
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Lỗi tạo sản phẩm.',
      };
    }
  }

  static async updateProduct(id: string, dto: UpdateProductDTO): Promise<ApiResponse> {
    try {
      const { updateProduct } = this.getUseCases();
      const updated = await updateProduct.execute(id, dto);
      return {
        success: true,
        data: updated,
        message: 'Cập nhật sản phẩm thành công!',
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Lỗi cập nhật sản phẩm.',
      };
    }
  }

  static async deleteProduct(id: string): Promise<ApiResponse> {
    try {
      const { deleteProduct } = this.getUseCases();
      await deleteProduct.execute(id);
      return {
        success: true,
        message: 'Xóa sản phẩm thành công!',
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Lỗi xóa sản phẩm.',
      };
    }
  }

  static async seedProducts(): Promise<ApiResponse> {
    try {
      const { seedProducts } = this.getUseCases();
      const seeded = await seedProducts.execute(INITIAL_FAKE_PRODUCTS);
      return {
        success: true,
        data: seeded,
        message: `Đã nạp thành công ${seeded.length} sản phẩm mẫu!`,
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Lỗi nạp dữ liệu mẫu.',
      };
    }
  }

  static async getHealthStatus(): Promise<ApiResponse> {
    try {
      const { getConnectionStatus } = this.getUseCases();
      const status = await getConnectionStatus.execute();
      return {
        success: true,
        data: status,
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Lỗi kiểm tra trạng thái database.',
      };
    }
  }
}
