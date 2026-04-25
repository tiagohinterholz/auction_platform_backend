import { DomainEvent } from './domain-event';

export class AuctionCreatedEvent implements DomainEvent<
  'AuctionCreated',
  {
    auctionId: string;
    description: string;
    startingPrice: number;
    minimumIncrement: number;
    images?: string[];
  }
> {
  readonly name = 'AuctionCreated';
  readonly occurredAt: string;
  readonly payload: {
    auctionId: string;
    description: string;
    startingPrice: number;
    minimumIncrement: number;
    images?: string[];
  };

  constructor(props: {
    auctionId: string;
    description: string;
    startingPrice: number;
    minimumIncrement: number;
    images?: string[];
  }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
}
