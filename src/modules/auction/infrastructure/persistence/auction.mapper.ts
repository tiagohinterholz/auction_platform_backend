import { Auction } from '../../domain/auction.aggregate';
import { AuctionPersistenceEntity } from './auction.persistence-entity';

export class AuctionMapper {
  static toPersistence(auction: Auction): AuctionPersistenceEntity {
    return {
      auctionId: auction.getId(),
      title: auction.getTitle(),
      status: auction.getStatus(),
      startTime: auction.getStartTime(),
      endTime: auction.getEndTime(),
      startingPrice: auction.getStartingPrice(),
      minimumIncrement: auction.getMinimumIncrement(),
    };
  }

  static toDomain(entity: AuctionPersistenceEntity): Auction {
    return Auction.restore({
      id: entity.auctionId,
      title: entity.title,
      startingPrice: entity.startingPrice,
      minimumIncrement: entity.minimumIncrement,
      startTime: entity.startTime,
      endTime: entity.endTime,
      status: entity.status,
    });
  }
}
