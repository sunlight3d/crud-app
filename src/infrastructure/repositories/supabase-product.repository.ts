import {
  calculateProductStatus,
  CreateProductDTO,
  Product,
  ProductFilterDTO,
  UpdateProductDTO,
} from '../../domain/entities/product';
import {
  IProductRepository,
  RepositoryConnectionStatus,
} from '../../domain/repositories/product-repository.interface';
import { getSupabaseClient, isSupabaseConfigured } from '../supabase/client';

interface SupabaseProductRow {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export class SupabaseProductRepository implements IProductRepository {
  private mapRowToEntity(row: SupabaseProductRow): Product {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      price: Number(row.price),
      stock: Number(row.stock),
      status: (row.status as Product['status']) || calculateProductStatus(Number(row.stock)),
      description: row.description || '',
      imageUrl: row.image_url || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getAll(filters?: ProductFilterDTO): Promise<Product[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client chưa được cấu hình.');
    }

    let query = supabase.from('products').select('*');

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      const q = filters.search.trim();
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`);
    }

    const sortBy = filters?.sortBy || 'created_at';
    const dbSortCol = sortBy === 'createdAt' ? 'created_at' : sortBy;
    const isAscending = filters?.sortOrder === 'asc';

    query = query.order(dbSortCol, { ascending: isAscending });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Lỗi truy vấn Supabase: ${error.message}`);
    }

    return (data as SupabaseProductRow[]).map(this.mapRowToEntity);
  }

  async getById(id: string): Promise<Product | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client chưa được cấu hình.');
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Lỗi tìm sản phẩm: ${error.message}`);
    }

    if (!data) return null;
    return this.mapRowToEntity(data as SupabaseProductRow);
  }

  async create(data: CreateProductDTO): Promise<Product> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client chưa được cấu hình.');
    }

    const calculatedStatus = data.status || calculateProductStatus(data.stock);

    const insertPayload = {
      name: data.name,
      category: data.category,
      price: data.price,
      stock: data.stock,
      status: calculatedStatus,
      description: data.description,
      image_url: data.imageUrl || null,
    };

    const { data: created, error } = await supabase
      .from('products')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Lỗi tạo sản phẩm trên Supabase: ${error.message}`);
    }

    return this.mapRowToEntity(created as SupabaseProductRow);
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client chưa được cấu hình.');
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.category !== undefined) updatePayload.category = data.category;
    if (data.price !== undefined) updatePayload.price = data.price;
    if (data.stock !== undefined) {
      updatePayload.stock = data.stock;
      if (!data.status) {
        updatePayload.status = calculateProductStatus(data.stock);
      }
    }
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.imageUrl !== undefined) updatePayload.image_url = data.imageUrl;

    const { data: updated, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Lỗi cập nhật sản phẩm trên Supabase: ${error.message}`);
    }

    return this.mapRowToEntity(updated as SupabaseProductRow);
  }

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client chưa được cấu hình.');
    }

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      throw new Error(`Lỗi xóa sản phẩm trên Supabase: ${error.message}`);
    }

    return true;
  }

  async seed(initialProducts: CreateProductDTO[]): Promise<Product[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client chưa được cấu hình.');
    }

    const rows = initialProducts.map(p => ({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      status: p.status || calculateProductStatus(p.stock),
      description: p.description,
      image_url: p.imageUrl || null,
    }));

    const { data, error } = await supabase.from('products').insert(rows).select('*');

    if (error) {
      throw new Error(`Lỗi nạp dữ liệu mẫu vào Supabase: ${error.message}`);
    }

    return (data as SupabaseProductRow[]).map(this.mapRowToEntity);
  }

  async getConnectionStatus(): Promise<RepositoryConnectionStatus> {
    if (!isSupabaseConfigured()) {
      return {
        isConnected: false,
        provider: 'supabase',
        message: 'Chưa cấu hình NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      };
    }

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return {
          isConnected: false,
          provider: 'supabase',
          message: 'Không thể khởi tạo Supabase client.',
        };
      }

      const { error } = await supabase.from('products').select('id').limit(1);

      if (error) {
        return {
          isConnected: false,
          provider: 'supabase',
          message: `Lỗi kết nối bảng 'products': ${error.message}. Hãy chạy file schema.sql trong Supabase SQL Editor.`,
        };
      }

      return {
        isConnected: true,
        provider: 'supabase',
        message: 'Kết nối cơ sở dữ liệu Supabase thành công 100%!',
      };
    } catch (err: unknown) {
      return {
        isConnected: false,
        provider: 'supabase',
        message: err instanceof Error ? err.message : 'Lỗi kết nối không xác định.',
      };
    }
  }
}
