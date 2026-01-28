import { AuctionStatus } from '../enums/auction-status.enum';

export type AuctionReadModel = {
  auctionId: string;
  status: AuctionStatus;
  startingPrice: number;
  minimumIncrement: number;
  startTime?: string;
  endTime?: string;
  reason?: string;
};
