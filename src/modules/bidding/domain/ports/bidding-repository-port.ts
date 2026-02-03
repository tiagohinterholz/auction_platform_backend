import { Bidding } from '../../domain/bidding.aggregate';

export interface BiddingRepositoryPort {
  findByAuctionId(auctionId: string): Bidding | null;
  save(bidding: Bidding): void;
  findAllByAuctionId(auctionId: string): Bidding[];
}
