import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { isSupabaseConfigured } from '../supabase/client';
import { MockProductRepository } from './mock-product.repository';
import { SupabaseProductRepository } from './supabase-product.repository';

class ResilientProductRepository implements IProductRepository {
  private supabaseRepo: SupabaseProductRepository;
  private mockRepo: MockProductRepository;

  constructor() {
    this.supabaseRepo = new SupabaseProductRepository();
    this.mockRepo = new MockProductRepository();
  }

  private shouldUseSupabase(): boolean {
    return isSupabaseConfigured();
  }

  async getAll(filters?: Parameters<IProductRepository['getAll']>[0]) {
    if (this.shouldUseSupabase()) {
      try {
        return await this.supabaseRepo.getAll(filters);
      } catch (error) {
        console.warn('Fallback to mock repo due to Supabase error:', error);
        return this.mockRepo.getAll(filters);
      }
    }
    return this.mockRepo.getAll(filters);
  }

  async getById(id: string) {
    if (this.shouldUseSupabase()) {
      try {
        const item = await this.supabaseRepo.getById(id);
        if (item) return item;
      } catch (error) {
        console.warn('Fallback to mock repo due to Supabase error:', error);
        return this.mockRepo.getById(id);
      }
    }
    return this.mockRepo.getById(id);
  }

  async create(data: Parameters<IProductRepository['create']>[0]) {
    if (this.shouldUseSupabase()) {
      try {
        return await this.supabaseRepo.create(data);
      } catch (error) {
        console.warn('Fallback to mock repo due to Supabase error:', error);
        return this.mockRepo.create(data);
      }
    }
    return this.mockRepo.create(data);
  }

  async update(id: string, data: Parameters<IProductRepository['update']>[1]) {
    if (this.shouldUseSupabase()) {
      try {
        return await this.supabaseRepo.update(id, data);
      } catch (error) {
        console.warn('Fallback to mock repo due to Supabase error:', error);
        return this.mockRepo.update(id, data);
      }
    }
    return this.mockRepo.update(id, data);
  }

  async delete(id: string) {
    if (this.shouldUseSupabase()) {
      try {
        return await this.supabaseRepo.delete(id);
      } catch (error) {
        console.warn('Fallback to mock repo due to Supabase error:', error);
        return this.mockRepo.delete(id);
      }
    }
    return this.mockRepo.delete(id);
  }

  async seed(initialProducts: Parameters<IProductRepository['seed']>[0]) {
    if (this.shouldUseSupabase()) {
      try {
        return await this.supabaseRepo.seed(initialProducts);
      } catch (error) {
        console.warn('Fallback to mock repo due to Supabase error:', error);
        return this.mockRepo.seed(initialProducts);
      }
    }
    return this.mockRepo.seed(initialProducts);
  }

  async getConnectionStatus() {
    if (this.shouldUseSupabase()) {
      return this.supabaseRepo.getConnectionStatus();
    }
    return this.mockRepo.getConnectionStatus();
  }
}

let repositoryInstance: IProductRepository | null = null;

export function getProductRepository(): IProductRepository {
  if (!repositoryInstance) {
    repositoryInstance = new ResilientProductRepository();
  }
  return repositoryInstance;
}
