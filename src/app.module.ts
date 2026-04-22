import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './shared/database/database.module';
import { AuctionModule } from './modules/auction/auction.module';
import { BiddingModule } from './modules/bidding/bidding.module';
import { RedisModule } from './shared/redis/redis.module';
import { LocksModule } from './shared/locks/locks.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
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
    RedisModule,
    LocksModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        },
      }),
    }),
  ],
})
export class AppModule {}
