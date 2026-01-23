import { AuctionReadModel } from '../read-models/auction-read.model';

export interface AuctionReadRepository {
  findById(id: string): Promise<AuctionReadModel | null>;
}
