import { DomainEvent } from './domain-event';

export class AuctionStartedEvent implements DomainEvent<
  'AuctionStarted',
  {
    auctionId: string;
    startedAt: string;
  }
> {
  readonly name = 'AuctionStarted';
  readonly occurredAt: string;
  S;
  readonly payload: {
    auctionId: string;
    startedAt: string;
  };

  constructor(props: { auctionId: string; startedAt: string }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
}
