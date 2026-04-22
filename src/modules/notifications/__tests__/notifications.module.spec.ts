import { NotificationsModule } from '../notifications.module';
import { BidPlacedEvent } from '../../bidding/domain/events/bid-placed.event';

describe('NotificationsModule Integration', () => {
  let gateway: any;
  let eventBus: any;
  let module: NotificationsModule;

  beforeEach(() => {
    gateway = {
      server: {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      },
    };
    eventBus = { subscribe: jest.fn() };
    module = new NotificationsModule(eventBus, gateway);
    module.onModuleInit();
  });

  it('should emit bidPlaced event to the correct room when BidPlacedEvent is published', async () => {
    const subscribeCall = eventBus.subscribe.mock.calls.find(
      (call: any) => call[0] === BidPlacedEvent.name,
    );
    const handlerFunction = subscribeCall[1];

    const event = new BidPlacedEvent({
      auctionId: 'auction-123',
      amount: 5000,
      bidderId: 'user-1',
      bidId: 'bid-1',
    });

    await handlerFunction(event);

    expect(gateway.server.to).toHaveBeenCalledWith('auction:auction-123');
    expect(gateway.server.emit).toHaveBeenCalledWith(
      'bidPlaced',
      event.payload,
    );
  });
});
