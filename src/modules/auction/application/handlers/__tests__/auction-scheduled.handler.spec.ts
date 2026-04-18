import { AuctionScheduledHandler } from '../auction-scheduled.handler';
import { AuctionReadRepository } from '../../read-models/auction-read.repository';
import { AuctionScheduledEvent } from '../../../domain/events/auction-scheduled.event';
import { AuctionStatus } from '../../../domain/enums/auction-status.enum';
import { InMemoryEventBus } from 'src/shared/events/in-memory-event-bus';

describe('AuctionScheduledHandler', () => {
  it('should create read model when auction is scheduled', async () => {
    const readRepo = new AuctionReadRepository();
    const handler = new AuctionScheduledHandler(readRepo);

    const event = new AuctionScheduledEvent({
      auctionId: 'auction-1',
      startTime: '2026-01-01T10:00:00Z',
      endTime: '2026-01-01T12:00:00Z',
      images: [],
      startingPrice: 1000,
      minimumIncrement: 100,
    });

    await handler.handle(event);

    const readModel = await readRepo.findById('auction-1');

    expect(readModel).toEqual({
      auctionId: 'auction-1',
      status: AuctionStatus.SCHEDULED,
      startTime: '2026-01-01T10:00:00Z',
      endTime: '2026-01-01T12:00:00Z',
      highestBid: 1000,
      images: [],
      startingPrice: 1000,
      minimumIncrement: 100,
    });
  });
  it('should update read model when event is published', async () => {
    const eventBus = new InMemoryEventBus();
    const readRepo = new AuctionReadRepository();

    const handler = new AuctionScheduledHandler(readRepo);

    eventBus.subscribe(
      AuctionScheduledEvent.name,
      async (event: AuctionScheduledEvent) => {
        await handler.handle(event);
      },
    );

    await eventBus.publish([
      new AuctionScheduledEvent({
        auctionId: 'auction-1',
        startTime: '2026-01-01T10:00:00Z',
        endTime: '2026-01-01T12:00:00Z',
        startingPrice: 1000,
        minimumIncrement: 100,
      }),
    ]);

    expect((await readRepo.findById('auction-1'))?.status).toBe(
      AuctionStatus.SCHEDULED,
    );
  });
});
