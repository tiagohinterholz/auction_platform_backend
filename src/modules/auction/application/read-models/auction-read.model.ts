import { AuctionStatus } from '../../domain/enums/auction-status.enum';

export type AuctionReadModel = {
  auctionId: string;
  status: AuctionStatus;
  startingPrice: number;
  highestBid: number;
  minimumIncrement: number;
  startTime?: string;
  endTime?: string;
  reason?: string;
  images?: string[];
};
