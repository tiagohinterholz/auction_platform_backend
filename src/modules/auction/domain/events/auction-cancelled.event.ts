import { DomainEvent } from './domain-event';

export class AuctionCancelledEvent implements DomainEvent<
  'AuctionCancelled',
  {
    auctionId: string;
    cancelledAt: string;
    reason?: string;
  }
> {
  readonly name = 'AuctionCancelled';
  readonly occurredAt: string;
  readonly payload: {
    auctionId: string;
    cancelledAt: string;
    reason?: string;
  };

  constructor(props: {
    auctionId: string;
    cancelledAt: string;
    reason?: string;
  }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
}
