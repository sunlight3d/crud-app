import { NextResponse } from 'next/server';
import { ProductController } from '@/controllers/product.controller';

export async function POST() {
  const response = await ProductController.seedProducts();
  const status = response.success ? 200 : 500;
  return NextResponse.json(response, { status });
}
