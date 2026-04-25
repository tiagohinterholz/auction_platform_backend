import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  startingPrice: number;

  @IsInt()
  @Min(1)
  minimumIncrement: number;

  @IsArray()
  @IsString({ each: true })
  images: string[];
}
