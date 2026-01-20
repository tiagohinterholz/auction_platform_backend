import { Auction } from '../../domain/auction.aggregate';

export interface AuctionRepository {
  save(auction: Auction): Promise<void>;
  findById(id: string): Promise<Auction | null>;
}
