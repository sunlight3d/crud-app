'use server';

import { revalidatePath } from 'next/cache';
import { CreateProductDTO, ProductFilterDTO, UpdateProductDTO } from '../domain/entities/product';
import { ProductController } from '../controllers/product.controller';

export async function getProductsAction(filters?: ProductFilterDTO) {
  return ProductController.getProducts(filters);
}

export async function getProductByIdAction(id: string) {
  return ProductController.getProductById(id);
}

export async function createProductAction(data: CreateProductDTO) {
  const result = await ProductController.createProduct(data);
  revalidatePath('/');
  return result;
}

export async function updateProductAction(id: string, data: UpdateProductDTO) {
  const result = await ProductController.updateProduct(id, data);
  revalidatePath('/');
  return result;
}

export async function deleteProductAction(id: string) {
  const result = await ProductController.deleteProduct(id);
  revalidatePath('/');
  return result;
}

export async function seedProductsAction() {
  const result = await ProductController.seedProducts();
  revalidatePath('/');
  return result;
}

export async function getHealthStatusAction() {
  return ProductController.getHealthStatus();
}
