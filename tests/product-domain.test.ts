import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateProductStatus } from '../src/domain/entities/product';
import { CreateProductUseCase } from '../src/usecases/create-product.usecase';
import { GetProductsUseCase } from '../src/usecases/get-products.usecase';
import { MockProductRepository } from '../src/infrastructure/repositories/mock-product.repository';

describe('Domain Logic - calculateProductStatus', () => {
  it('should return out_of_stock when stock is 0 or negative', () => {
    assert.equal(calculateProductStatus(0), 'out_of_stock');
    assert.equal(calculateProductStatus(-5), 'out_of_stock');
  });

  it('should return low_stock when stock is between 1 and 5', () => {
    assert.equal(calculateProductStatus(1), 'low_stock');
    assert.equal(calculateProductStatus(3), 'low_stock');
    assert.equal(calculateProductStatus(5), 'low_stock');
  });

  it('should return in_stock when stock is greater than 5', () => {
    assert.equal(calculateProductStatus(6), 'in_stock');
    assert.equal(calculateProductStatus(100), 'in_stock');
  });
});

describe('Use Cases & Mock Repository', () => {
  const repo = new MockProductRepository();
  const getProductsUseCase = new GetProductsUseCase(repo);
  const createProductUseCase = new CreateProductUseCase(repo);

  it('should list all initial fake products', async () => {
    const products = await getProductsUseCase.execute();
    assert.ok(products.length >= 12, 'Must have at least 12 fake products preloaded');
  });

  it('should filter products by category', async () => {
    const products = await getProductsUseCase.execute({ category: 'Laptops' });
    assert.ok(products.length > 0);
    products.forEach(p => assert.equal(p.category, 'Laptops'));
  });

  it('should create a new product successfully with valid data', async () => {
    const newProd = await createProductUseCase.execute({
      name: 'MacBook Air M3 Test',
      category: 'Laptops',
      price: 1099,
      stock: 10,
      description: 'Test description',
    });

    assert.ok(newProd.id);
    assert.equal(newProd.name, 'MacBook Air M3 Test');
    assert.equal(newProd.status, 'in_stock');
  });

  it('should throw an error when product name is empty', async () => {
    await assert.rejects(
      async () => {
        await createProductUseCase.execute({
          name: '',
          category: 'Laptops',
          price: 100,
          stock: 1,
          description: 'Test',
        });
      },
      {
        message: 'Tên sản phẩm không được để trống.',
      }
    );
  });
});
