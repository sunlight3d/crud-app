import { NextRequest, NextResponse } from 'next/server';
import { ProductController } from '@/controllers/product.controller';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const response = await ProductController.getProductById(id);
  const status = response.success ? 200 : 404;
  return NextResponse.json(response, { status });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const response = await ProductController.updateProduct(id, body);
    const status = response.success ? 200 : 400;
    return NextResponse.json(response, { status });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Invalid JSON body' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const response = await ProductController.deleteProduct(id);
  const status = response.success ? 200 : 400;
  return NextResponse.json(response, { status });
}
