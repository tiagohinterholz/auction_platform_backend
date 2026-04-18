import { Bidding } from '../../domain/bidding.aggregate';

export interface BiddingRepositoryPort {
  findByAuctionId(auctionId: string): Promise<Bidding | null>;
  save(bidding: Bidding): Promise<void>;
  findAllByAuctionId(auctionId: string): Promise<Bidding[]>;
}
