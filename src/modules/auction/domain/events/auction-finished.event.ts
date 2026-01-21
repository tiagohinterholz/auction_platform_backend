import { DomainEvent } from './domain-event';

export class AuctionFinishedEvent implements DomainEvent<
  'AuctionFinished',
  {
    auctionId: string;
    finishedAt: string;
  }
> {
  readonly name = 'AuctionFinished';
  readonly occurredAt: string;
  readonly payload: {
    auctionId: string;
    finishedAt: string;
  };

  constructor(props: { auctionId: string; finishedAt: string }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
}
