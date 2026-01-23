import { Bidding } from '../bidding.aggregate';
import { BidPlacedEvent } from '../events/bid-placed.event';
import { InvalidBidPlaced } from '../exceptions/invalid-bid-placed.exception';

describe('BiddingAggregate', () => {
  it('should create a valid bid', () => {
    const bidding = Bidding.open({
      id: 'bidding-1',
      auctionId: 'auction-1',
      startingPrice: 10000,
      minimumIncrement: 2000,
      auctionStatus: 'ACTIVE',
    });

    bidding.placeBid({
      bidderId: 'bidding-1',
      amount: 13000,
      now: new Date(),
    });

    const events = bidding.pullDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(BidPlacedEvent);
    expect(bidding.getCurrentPrice()).toBe(13000);
  });
});

describe('BiddingAGgreegate', () => {
  it('should throw error when Auction status is diferent from ACTIVE', () => {
    expect(() => {
      Bidding.open({
        id: 'bidding-1',
        auctionId: 'auction-1',
        startingPrice: 10000,
        minimumIncrement: 2000,
        auctionStatus: 'FINISHED',
      });
    }).toThrow(InvalidBidPlaced);
  });

  it('should throw error when BidPlaced has amount less than 0', () => {
    const bidding = Bidding.open({
      id: 'bidding-1',
      auctionId: 'auction-1',
      startingPrice: 10000,
      minimumIncrement: 2000,
      auctionStatus: 'ACTIVE',
    });

    expect(() => {
      bidding.placeBid({
        bidderId: 'bidding-1',
        amount: -10000,
        now: new Date(),
      });
    }).toThrow(InvalidBidPlaced);
  });
  it('should throw error when BidPlaced has amount less than current price plus minimum increment', () => {
    const bidding = Bidding.open({
      id: 'bidding-1',
      auctionId: 'auction-1',
      startingPrice: 10000,
      minimumIncrement: 2000,
      auctionStatus: 'ACTIVE',
    });

    expect(() => {
      bidding.placeBid({
        bidderId: 'bidding-1',
        amount: 10000,
        now: new Date(),
      });
    }).toThrow(InvalidBidPlaced);
  });
});
