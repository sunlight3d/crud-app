import { NextResponse } from 'next/server';
import { ProductController } from '@/controllers/product.controller';

export async function GET() {
  const response = await ProductController.getHealthStatus();
  return NextResponse.json(response);
}
