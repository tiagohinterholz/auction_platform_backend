import { Auction } from '../../domain/auction.aggregate';
import { AuctionRepositoryPort } from '../../domain/ports/auction-repository.port';
import { AuctionMapper } from '../persistence/auction.mapper';
import { AuctionPersistenceEntity } from '../persistence/auction.persistence-entity';

export class AuctionRepository implements AuctionRepositoryPort {
  private storage = new Map<string, AuctionPersistenceEntity>();

  save(auction: Auction): void {
    const entity = AuctionMapper.toPersistence(auction);
    this.storage.set(entity.auctionId, entity);
  }

  findById(id: string): Auction | null {
    const entity = this.storage.get(id);
    if (!entity) return null;
    return AuctionMapper.toDomain(entity);
  }
}
