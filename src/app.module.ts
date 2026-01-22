import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './shared/database/database.module';
import { AuctionModule } from './modules/auction/auction.module';
import { BiddingModule } from './modules/bidding/bidding.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    HealthModule,
    AuctionModule,
    BiddingModule,
  ],
})
export class AppModule {}
