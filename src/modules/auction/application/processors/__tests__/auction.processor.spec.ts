import { AuctionProcessor } from '../auction.processor';

describe('Auction Processor', () => {
  let processor: AuctionProcessor;
  let startUseCase: any;
  let finishUseCase: any;

  beforeEach(() => {
    startUseCase = { execute: jest.fn() };
    finishUseCase = { execute: jest.fn() };
    processor = new AuctionProcessor(finishUseCase, startUseCase);
  });

  it('should call StartAuctionUseCase when job is start-auction', async () => {
    const mockJob = {
      name: 'start-auction',
      data: { auctionId: 'auction-1' },
    };
    await processor.process(mockJob as any);
    expect(startUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ auctionId: 'auction-1' }),
    );
  });

  it('should call FinishAuctionUseCase when job is finish-auction', async () => {
    const mockJob = {
      name: 'finish-auction',
      data: { auctionId: 'auction-1' },
    };
    await processor.process(mockJob as any);
    expect(finishUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ auctionId: 'auction-1' }),
    );
  });
});
