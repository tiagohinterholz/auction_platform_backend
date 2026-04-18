import { Bidding } from '../../domain/bidding.aggregate';
import { BiddingRepositoryPort } from '../../domain/ports/bidding-repository-port';
import { BiddingMapper } from '../persistence/bidding.mapper';
import { BiddingPersistenceEntity } from '../persistence/bidding.persistence-entity';

export class BiddingRepository implements BiddingRepositoryPort {
  private storage = new Map<string, BiddingPersistenceEntity>();

  async findByAuctionId(auctionId: string): Promise<Bidding | null> {
    const entity = this.storage.get(auctionId);

    return entity ? BiddingMapper.toDomain(entity) : null;
  }

  async save(bidding: Bidding): Promise<void> {
    const entity = BiddingMapper.toPersistence(bidding);
    this.storage.set(bidding.getAuctionId(), entity);
  }

  async findAllByAuctionId(auctionId: string): Promise<Bidding[]> {
    const bids: Bidding[] = [];

    for (const entity of this.storage.values()) {
      if (entity.auctionId === auctionId) {
        bids.push(BiddingMapper.toDomain(entity));
      }
    }

    return bids;
  }
}
