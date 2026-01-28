import { AuctionStatus } from '../../domain/enums/auction-status.enum';

export class AuctionPersistenceEntity {
  auctionId: string;
  title: string;
  status: AuctionStatus;
  startTime?: string;
  endTime?: string;
  startingPrice: number;
  minimumIncrement: number;
}
