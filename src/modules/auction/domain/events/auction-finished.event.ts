import { DomainEvent } from './domain-event';

export type AuctionFinishedEvent = DomainEvent<
  'AuctionFinished',
  {
    auctionId: string;
    finishedAt: string;
  }
>;
