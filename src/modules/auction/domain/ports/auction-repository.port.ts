import { Auction } from '../../domain/auction.aggregate';

export interface AuctionRepositoryPort {
  save(auction: Auction): Promise<void>;
  findById(id: string): Promise<Auction | null>;
}
