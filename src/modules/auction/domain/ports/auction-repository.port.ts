import { Auction } from '../../domain/auction.aggregate';

export interface AuctionRepositoryPort {
  save(auction: Auction): void;
  findById(id: string): Auction | null;
}
