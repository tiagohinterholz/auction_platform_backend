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

@Controller('auctions')
export class BiddingController {
  constructor(
    private readonly placeBidUseCase: PlaceBidUseCase,
    private readonly biddingRepository: BiddingRepository,
  ) {}

  @Get(':auctionId')
  getAllByAuctionId(@Param('id') id: string) {
    const bids = this.biddingRepository.findAllByAuctionId(id);

    if (!bids) {
      throw new NotFoundException('Bids list not found');
    }
  }

  @Post()
  createBid(@Body() dto: CreateBidDto) {
    void this.placeBidUseCase.execute(dto);

    return { status: 'created' };
  }
}
