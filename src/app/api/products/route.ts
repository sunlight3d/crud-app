import { NextRequest, NextResponse } from 'next/server';
import { ProductController } from '@/controllers/product.controller';
import { ProductFilterDTO } from '@/domain/entities/product';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters: ProductFilterDTO = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    status: (searchParams.get('status') as ProductFilterDTO['status']) || undefined,
    sortBy: (searchParams.get('sortBy') as ProductFilterDTO['sortBy']) || undefined,
    sortOrder: (searchParams.get('sortOrder') as ProductFilterDTO['sortOrder']) || undefined,
  };

  const response = await ProductController.getProducts(filters);
  const status = response.success ? 200 : 400;
  return NextResponse.json(response, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await ProductController.createProduct(body);
    const status = response.success ? 201 : 400;
    return NextResponse.json(response, { status });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Invalid JSON body' },
      { status: 400 }
    );
  }
}
