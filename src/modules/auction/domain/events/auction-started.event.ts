import { DomainEvent } from './domain-event';

export type AuctionStartedEvent = DomainEvent<
  'AuctionStarted',
  {
    auctionId: string;
    startedAt: string;
  }
>;
