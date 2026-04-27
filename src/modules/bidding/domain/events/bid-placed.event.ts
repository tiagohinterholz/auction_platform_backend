import { DomainEvent } from './domain-event';

export class BidPlacedEvent implements DomainEvent<
  'BidPlaced',
  {
    bidId: string;
    auctionId: string;
    userId: string;
    amount: number;
  }
> {
  readonly name = 'BidPlaced';
  readonly occurredAt: string;
  readonly payload: {
    bidId: string;
    auctionId: string;
    userId: string;
    amount: number;
  };

  constructor(props: {
    bidId: string;
    auctionId: string;
    userId: string;
    amount: number;
  }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
}
