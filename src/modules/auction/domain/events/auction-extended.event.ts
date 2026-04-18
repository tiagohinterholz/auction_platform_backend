import { DomainEvent } from './domain-event';

export class AuctionExtendedEvent implements DomainEvent<
  'AuctionExtended',
  {
    auctionId: string;
    newEndTime: string;
  }
> {
  readonly name = 'AuctionExtended';
  readonly occurredAt: string;
  readonly payload: {
    auctionId: string;
    newEndTime: string;
  };

  constructor(props: { auctionId: string; newEndTime: string }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
}
