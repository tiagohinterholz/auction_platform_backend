import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { PlaceBidUseCase } from '../../application/use-cases/place-bid.use-case';
import { BiddingRepository } from '../../infrastructure/repository/bidding.repository';
import { CreateBidDto } from '../../application/dtos/create-bid.dto';

@Controller('auctions/auctionId/bids')
export class BiddingController {
  constructor(
    private readonly placeBidUseCase: PlaceBidUseCase,
    private readonly biddingRepository: BiddingRepository,
  ) {}

  @Get()
  getAllByAuctionId(@Param('auctionId') auctionId: string) {
    const bids = this.biddingRepository.findAllByAuctionId(auctionId);

    if (!bids) {
      throw new NotFoundException('Bids list not found');
    }
    return bids;
  }

  @Post()
  createBid(@Param('auctionId') auctionId: string, @Body() dto: CreateBidDto) {
    void this.placeBidUseCase.execute({
      bidId: crypto.randomUUID(),
      auctionId,
      bidderId: 'mock-user',
      amount: dto.amount,
      now: new Date(),
    });

    return { status: 'created' };
  }
}
