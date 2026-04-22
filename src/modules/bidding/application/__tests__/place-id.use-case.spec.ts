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
  let lockService: any;

  beforeEach(() => {
    const mockBiddingTypeOrm = {
      save: jest.fn().mockImplementation((e) => {
        biddingRepository['_bids'] = biddingRepository['_bids'] || new Map();
        biddingRepository['_bids'].set(e.auctionId, e);
      }),
      findOneBy: jest
        .fn()
        .mockImplementation(
          (obj) => biddingRepository['_bids']?.get(obj.auctionId) || null,
        ),
      findBy: jest.fn().mockResolvedValue([]),
    };

    const mockReadTypeOrm = {
      _store: new Map(),
      save: jest.fn().mockImplementation(function (e) {
        this._store.set(e.auctionId, e);
      }),
      findOneBy: jest.fn().mockImplementation(function (obj) {
        return this._store.get(obj.auctionId) || null;
      }),
    };

    biddingRepository = new BiddingRepository(mockBiddingTypeOrm as any);
    auctionReadRepository = new AuctionReadRepository(mockReadTypeOrm as any);
    eventBus = new InMemoryEventBus();

    lockService = {
      acquire: jest.fn().mockResolvedValue(true),
      release: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new PlaceBidUseCase(
      biddingRepository,
      auctionReadRepository,
      eventBus,
      lockService,
    );
  });

  it('should throw error when auction is not ACTIVE', async () => {
    await auctionReadRepository.save({
      auctionId: 'auction-1',
      status: AuctionStatus.FINISHED,
      startingPrice: 10000,
      minimumIncrement: 2000,
      highestBid: 10000,
    });

    await expect(() =>
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
    await auctionReadRepository.save({
      auctionId: 'auction-1',
      status: AuctionStatus.ACTIVE,
      startingPrice: 10000,
      minimumIncrement: 2000,
      highestBid: 10000,
    });

    await useCase.execute({
      bidId: 'bid-1',
      auctionId: 'auction-1',
      bidderId: 'user-1',
      amount: 15000,
      now: new Date(),
    });

    const biddingResult = await biddingRepository.findByAuctionId('auction-1');

    expect(biddingResult).not.toBeNull();
    expect(biddingResult?.getLastBidAmount()).toBe(15000);
    expect(biddingResult?.getLastBidderId()).toBe('user-1');
  });
});
