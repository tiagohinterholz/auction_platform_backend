import { PlaceBidUseCase } from '../use-cases/place-bid.use-case';
import { InvalidBidPlaced } from '../../domain/exceptions/invalid-bid-placed.exception';
import { AuctionReadRepository } from 'src/modules/auction/application/read-models/auction-read.repository';
import { InMemoryEventBus } from 'src/shared/events/in-memory-event-bus';
import { AuctionStatus } from 'src/modules/auction/domain/enums/auction-status.enum';
import { BiddingRepository } from '../../infrastructure/repository/bidding.repository';

describe('PlaceBidUseCase', () => {
  let useCase: PlaceBidUseCase;

  let biddingRepository: BiddingRepository;

  let auctionReadRepository: AuctionReadRepository;
  let eventBus: InMemoryEventBus;

  beforeEach(() => {
    biddingRepository = new BiddingRepository();

    auctionReadRepository = new AuctionReadRepository();
    eventBus = new InMemoryEventBus();

    useCase = new PlaceBidUseCase(
      biddingRepository,
      auctionReadRepository,
      eventBus,
    );
  });

  it('should throw error when auction is not ACTIVE', () => {
    auctionReadRepository.save({
      auctionId: 'auction-1',
      status: AuctionStatus.FINISHED,
      startingPrice: 10000,
      minimumIncrement: 2000,
    });

    expect(() =>
      useCase.execute({
        bidId: 'bid-1',
        auctionId: 'auction-1',
        bidderId: 'user-1',
        amount: 15000,
        now: new Date(),
      }),
    ).toThrow(InvalidBidPlaced);
  });

  it('should place bid successfully when auction is ACTIVE', () => {
    auctionReadRepository.save({
      auctionId: 'auction-1',
      status: AuctionStatus.ACTIVE,
      startingPrice: 10000,
      minimumIncrement: 2000,
    });

    useCase.execute({
      bidId: 'bid-1',
      auctionId: 'auction-1',
      bidderId: 'user-1',
      amount: 15000,
      now: new Date(),
    });

    const bidding = biddingRepository.findByAuctionId('auction-1');

    expect(bidding).not.toBeNull();
    expect(bidding?.getLastBidAmount()).toBe(15000);
    expect(bidding?.getLastBidderId()).toBe('user-1');
  });
});
