// domain/__tests__/fixtures/auction.fixture.ts
import { Auction } from '../../auction.aggregate';

export class AuctionFixture {
  static created(
    overrides?: Partial<{
      id: string;
      title: string;
      startingPrice: number;
      minimumIncrement: number;
    }>,
  ) {
    return Auction.create({
      id: 'auction-1',
      title: 'MacBook Pro',
      startingPrice: 10000,
      minimumIncrement: 1000,
      images: [],
      ...overrides,
    });
  }

  static scheduled() {
    const auction = this.created();

    auction.schedule({
      startTime: new Date(Date.now() + 60_000).toISOString(),
      endTime: new Date(Date.now() + 3_600_000).toISOString(),
      now: new Date(),
    });

    auction.pullDomainEvents();
    return auction;
  }

  static active() {
    const auction = this.scheduled();

    auction.start({
      now: new Date(Date.now() + 3_700_000),
    });

    auction.pullDomainEvents();
    return auction;
  }
}
