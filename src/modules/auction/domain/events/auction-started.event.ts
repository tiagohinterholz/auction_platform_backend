import { DomainEvent } from './domain-event';

export class AuctionStartedEvent implements DomainEvent<
  'AuctionStarted',
  {
    auctionId: string;
    startingPrice: number;
    minimumIncrement: number;
    startedAt: string;
  }
> {
  readonly name = 'AuctionStarted';
  readonly occurredAt: string;
  readonly payload: {
    auctionId: string;
    startingPrice: number;
    minimumIncrement: number;
    startedAt: string;
  };

  constructor(props: {
    auctionId: string;
    startingPrice: number;
    minimumIncrement: number;
    startedAt: string;
  }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
}
