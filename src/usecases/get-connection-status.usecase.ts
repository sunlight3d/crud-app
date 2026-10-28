import { IProductRepository, RepositoryConnectionStatus } from '../domain/repositories/product-repository.interface';

export class GetConnectionStatusUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(): Promise<RepositoryConnectionStatus> {
    return this.productRepo.getConnectionStatus();
  }
}
