import { AuctionStatus } from '../enums/auction-status.enum';
import { AuctionScheduledEvent } from '../events/auction-scheduled.event';
import { AuctionFinishedEvent } from '../events/auction-finished.event';
import { AuctionCancelledEvent } from '../events/auction-cancelled.event';
import { AuctionFixture } from './fixtures/auction.fixture';
import { InvalidAuctionTransitionException } from '../exceptions/invalid-auction-transition.exception';

describe('AuctionAggregate', () => {
  it('should create auction in DRAFT status', () => {
    const auction = AuctionFixture.draft();

    expect(auction.getStatus()).toBe(AuctionStatus.DRAFT);
    expect(auction.getStartingPrice()).toBe(10000);
  });

  it('should schedule auction and emit AuctionScheduledEvent', () => {
    const auction = AuctionFixture.draft();

    auction.schedule({
      startTime: new Date(Date.now() + 60_000).toISOString(),
      endTime: new Date(Date.now() + 3_600_000).toISOString(),
      now: new Date(),
    });

    const events = auction.pullDomainEvents();

    expect(auction.getStatus()).toBe(AuctionStatus.SCHEDULED);
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(AuctionScheduledEvent);
  });

  it('should finish auction and emit AuctionFinishEvent', () => {
    const auction = AuctionFixture.active();

    auction.finish({
      now: new Date(Date.now() + 3_800_000),
    });

    const events = auction.pullDomainEvents();

    expect(auction.getStatus()).toBe(AuctionStatus.FINISHED);
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(AuctionFinishedEvent);
  });

  it('should cancelled auction scheduled and emit AuctionCancelledEvent', () => {
    const auction = AuctionFixture.scheduled();

    auction.cancel({
      now: new Date(),
      reason: 'Fraud Detected',
    });

    const events = auction.pullDomainEvents();

    expect(auction.getStatus()).toBe(AuctionStatus.CANCELLED);
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(AuctionCancelledEvent);
  });

  it('should cancelled auction active and emit AuctionCancelledEvent', () => {
    const auction = AuctionFixture.active();

    auction.cancel({
      now: new Date(),
      reason: 'Fraud Detected',
    });

    const events = auction.pullDomainEvents();

    expect(auction.getStatus()).toBe(AuctionStatus.CANCELLED);
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(AuctionCancelledEvent);
  });
});

describe('AuctionAggregate - invalid transitions', () => {
  it('should throw error when trying to cancel a finished auction', () => {
    const auction = AuctionFixture.active();

    auction.finish({
      now: new Date(Date.now() + 3_800_000),
    });

    expect(auction.getStatus()).toBe(AuctionStatus.FINISHED);

    expect(() => {
      auction.cancel({
        now: new Date(),
        reason: 'Fraud detected',
      });
    }).toThrow(InvalidAuctionTransitionException);
  });
});
