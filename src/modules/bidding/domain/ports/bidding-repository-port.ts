import { Bidding } from '../../domain/bidding.aggregate';

export interface BiddingRepository {
  save(bidding: Bidding): Promise<void>;
}
