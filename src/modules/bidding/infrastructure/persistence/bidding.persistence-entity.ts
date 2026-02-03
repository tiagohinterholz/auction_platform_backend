export class BiddingPersistenceEntity {
  id: string;
  auctionId: string;
  currentPrice: number;
  minimumIncrement: number;
  lastBidderId?: string;
  lastBidAmount?: number;
  lastBidAt?: string;
}
