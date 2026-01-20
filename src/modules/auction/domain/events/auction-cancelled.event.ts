import { DomainEvent } from './domain-event';

export type AuctionCancelledEvent = DomainEvent<
  'AuctionCancelled',
  {
    auctionId: string;
    cancelledAt: string;
    reason?: string;
  }
>;
