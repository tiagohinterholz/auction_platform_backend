import { DomainEvent } from './domain-event';

export class AuctionScheduledEvent implements DomainEvent<
  'AuctionScheduled',
  {
    auctionId: string;
    startTime: string;
    endTime: string;
    startingPrice: number;
    minimumIncrement: number;
    images?: string[];
  }
> {
  readonly name = 'AuctionScheduled';
  readonly occurredAt: string;
  readonly payload: {
    auctionId: string;
    startTime: string;
    endTime: string;
    startingPrice: number;
    minimumIncrement: number;
    images?: string[];
  };

  constructor(props: {
    auctionId: string;
    startTime: string;
    endTime: string;
    startingPrice: number;
    minimumIncrement: number;
    images?: string[];
  }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
}
