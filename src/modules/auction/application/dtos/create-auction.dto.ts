import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @Min(0)
  startingPrice: number;

  @IsInt()
  @Min(1)
  minimumIncrement: number;
}
