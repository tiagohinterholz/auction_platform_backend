import { PlaceBidUseCase } from '../use-cases/place-bid.use-case';
import { InvalidBidPlaced } from '../../domain/exceptions/invalid-bid-placed.exception';
import { AuctionReadRepository } from 'src/modules/auction/application/read-models/auction-read.repository';
import { InMemoryEventBus } from 'src/shared/events/in-memory-event-bus';
import { AuctionStatus } from 'src/modules/auction/domain/enums/auction-status.enum';

describe('PlaceBidUseCase', () => {
  let useCase: PlaceBidUseCase;

  let biddingRepository: {
    findByAuctionId: jest.Mock;
    save: jest.Mock;
  };

  let auctionReadRepository: AuctionReadRepository;
  let eventBus: InMemoryEventBus;
  let publishSpy: jest.SpyInstance;

  beforeEach(() => {
    biddingRepository = {
      findByAuctionId: jest.fn(),
      save: jest.fn(),
    };

    auctionReadRepository = new AuctionReadRepository();
    eventBus = new InMemoryEventBus();
    publishSpy = jest.spyOn(eventBus, 'publish');

    useCase = new PlaceBidUseCase(
      biddingRepository,
      auctionReadRepository,
      eventBus,
    );
  });

  it('should throw error when auction is not ACTIVE', async () => {
    auctionReadRepository.save({
      auctionId: 'auction-1',
      status: AuctionStatus.FINISHED,
      startingPrice: 10000,
      minimumIncrement: 2000,
    });

    await expect(
      useCase.execute({
        bidId: 'bid-1',
        auctionId: 'auction-1',
        bidderId: 'user-1',
        amount: 15000,
        now: new Date(),
      }),
    ).rejects.toThrow(InvalidBidPlaced);
  });

  it('should place bid successfully when auction is ACTIVE', async () => {
    auctionReadRepository.save({
      auctionId: 'auction-1',
      status: AuctionStatus.ACTIVE,
      startingPrice: 10000,
      minimumIncrement: 2000,
    });

    biddingRepository.findByAuctionId.mockResolvedValue(null);

    await useCase.execute({
      bidId: 'bid-1',
      auctionId: 'auction-1',
      bidderId: 'user-1',
      amount: 15000,
      now: new Date(),
    });

    expect(biddingRepository.save).toHaveBeenCalled();
    expect(publishSpy).toHaveBeenCalled();
  });
});
