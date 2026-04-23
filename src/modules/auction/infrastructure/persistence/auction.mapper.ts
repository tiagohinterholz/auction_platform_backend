import { Auction } from '../../domain/auction.aggregate';
import { AuctionPersistenceEntity } from './auction.persistence-entity';

export class AuctionMapper {
  static toPersistence(auction: Auction): AuctionPersistenceEntity {
    const entity = new AuctionPersistenceEntity();
    entity.auctionId = auction.getId();
    entity.title = auction.getTitle();
    entity.description = auction.getDescription();
    entity.status = auction.getStatus();
    entity.startTime = auction.getStartTime();
    entity.endTime = auction.getEndTime();
    entity.startingPrice = auction.getStartingPrice();
    entity.minimumIncrement = auction.getMinimumIncrement();
    entity.images = auction.getImages();
    return entity;
  }

  static toDomain(entity: AuctionPersistenceEntity): Auction {
    return Auction.restore({
      id: entity.auctionId,
      title: entity.title,
      description: entity.description,
      startingPrice: entity.startingPrice,
      minimumIncrement: entity.minimumIncrement,
      startTime: entity.startTime,
      endTime: entity.endTime,
      status: entity.status,
      images: entity.images,
    });
  }
}
