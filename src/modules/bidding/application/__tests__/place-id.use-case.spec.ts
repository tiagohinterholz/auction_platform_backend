import { PlaceBidUseCase } from '../use-cases/place-bid.use-case';
import { InvalidBidPlaced } from '../../domain/exceptions/invalid-bid-placed.exception';

describe('PlaceBidUseCase', () => {
  let useCase: PlaceBidUseCase;

  let biddingRepository: {
    findByAuctionId: jest.Mock;
    save: jest.Mock;
  };

  let auctionReadRepository: {
    findById: jest.Mock;
  };

  let eventBus: {
    publish: jest.Mock;
  };

  beforeEach(() => {
    biddingRepository = {
      findByAuctionId: jest.fn(),
      save: jest.fn(),
    };

    auctionReadRepository = {
      findById: jest.fn(),
    };

    eventBus = {
      publish: jest.fn(),
    };

    useCase = new PlaceBidUseCase(
      biddingRepository,
      auctionReadRepository,
      eventBus,
    );
  });

  it('should throw error when auction is not ACTIVE', async () => {
    auctionReadRepository.findById.mockResolvedValue({
      id: 'auction-1',
      status: 'FINISHED',
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
    auctionReadRepository.findById.mockResolvedValue({
      id: 'auction-1',
      status: 'ACTIVE',
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
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
