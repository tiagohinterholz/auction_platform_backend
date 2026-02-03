import { IsInt, IsISO8601, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBidDto {
  @IsString()
  @IsNotEmpty()
  id: string;

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
  now: string;
}
