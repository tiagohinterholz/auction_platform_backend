import { Auction } from '../../domain/auction.aggregate';
import { AuctionRepository } from '../../domain/ports/auction-repository.port';

export class InMemoryAuctionRepository implements AuctionRepository {
  private storage = new Map<string, Auction>();

  async save(auction: Auction): Promise<void> {
    this.storage.set(auction.id, auction);
  }

  async findById(id: string): Promise<Auction | null> {
    return this.storage.get(id) ?? null;
  }
}
