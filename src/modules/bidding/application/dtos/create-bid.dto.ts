import { IsInt, IsISO8601, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBidDto {
  @IsString()
  @IsNotEmpty()
  bidId: string;

  @IsString()
  @IsNotEmpty()
  auctionId: string;

  @IsString()
  @IsNotEmpty()
  bidderId: string;

  @IsInt()
  @Min(0)
  amount: number;

  @IsISO8601()
  now: Date;
}
