import { AuctionReadModel } from '../read-models/auction-read.model';

export class AuctionReadRepository {
  private store = new Map<string, AuctionReadModel>();

  async save(model: AuctionReadModel): Promise<void> {
    this.store.set(model.auctionId, model);
  }

  async findById(id: string): Promise<AuctionReadModel | null> {
    return this.store.get(id);
  }

  async findAll(): Promise<AuctionReadModel[]> {
    return [...this.store.values()];
  }
}
