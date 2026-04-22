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

@Controller('auctions/:auctionId/bids')
export class BiddingController {
  constructor(
    private readonly placeBidUseCase: PlaceBidUseCase,
    private readonly biddingRepository: BiddingRepository,
  ) {}

  @Get()
  async getAllByAuctionId(@Param('auctionId') auctionId: string) {
    const bids = await this.biddingRepository.findAllByAuctionId(auctionId);

    if (!bids) {
      throw new NotFoundException('Bids list not found');
    }
    return bids;
  }

  @Post()
  async createBid(
    @Param('auctionId') auctionId: string,
    @Body() dto: CreateBidDto,
  ) {
    await this.placeBidUseCase.execute({
      bidId: crypto.randomUUID(),
      auctionId,
      bidderId: 'mock-user',
      amount: dto.amount,
      now: new Date(),
    });

    return { status: 'created' };
  }
}
