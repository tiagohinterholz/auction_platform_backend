import { Bidding } from '../../domain/bidding.aggregate';

export interface BiddingRepository {
  findByAuctionId(auctionId: string): Promise<Bidding | null>;
  save(bidding: Bidding): Promise<void>;
}
