import { Bidding } from '../../domain/bidding.aggregate';
import { BiddingPersistenceEntity } from './bidding.persistence-entity';

export class BiddingMapper {
  static toPersistence(bidding: Bidding): BiddingPersistenceEntity {
    return {
      id: bidding.getId(),
      auctionId: bidding.getAuctionId(),
      currentPrice: bidding.getCurrentPrice(),
      minimumIncrement: bidding.getMinimumIncrement(),
      lastBidderId: bidding.getLastBidderId(),
      lastBidAmount: bidding.getLastBidAmount(),
      lastBidAt: bidding.getLastBidAt(),
    };
  }

  static toDomain(entity: BiddingPersistenceEntity): Bidding {
    return Bidding.restore({
      id: entity.auctionId,
      auctionId: entity.auctionId,
      currentPrice: entity.currentPrice,
      minimumIncrement: entity.minimumIncrement,
      lastBidderId: entity.lastBidderId,
      lastBidAmount: entity.lastBidAmount,
      lastBidAt: entity.lastBidAt,
    });
  }
}
