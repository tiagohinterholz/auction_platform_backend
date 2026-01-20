import { DomainEvent } from './domain-event';

export type AuctionScheduledEvent = DomainEvent<
  'AuctionScheduled',
  {
    auctionId: string;
    startTime: string;
    endTime: string;
  }
>;
