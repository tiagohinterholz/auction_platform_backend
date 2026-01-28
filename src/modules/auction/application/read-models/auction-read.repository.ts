import { AuctionReadModel } from '../read-models/auction-read.model';

export class AuctionReadRepository {
  private store = new Map<string, AuctionReadModel>();

  save(model: AuctionReadModel) {
    this.store.set(model.auctionId, model);
  }

  findById(id: string) {
    return this.store.get(id);
  }

  findAll() {
    return [...this.store.values()];
  }
}
