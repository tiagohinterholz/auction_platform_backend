import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { AUCTION_REPOSITORY, EVENT_BUS } from './domain/ports/tokens';
import { AuctionRepository } from './infrastructure/repository/auction.repository';
import { AuctionController } from './presentation/controllers/auction.controller';
import { CreateAuctionUseCase } from './application/use-cases/create-auction.use-case';
import { ScheduleAuctionUseCase } from './application/use-cases/schedule-auction.use-case';
import { CancelAuctionUseCase } from './application/use-cases/cancel-auction.use-case';
import { FinishAuctionUseCase } from './application/use-cases/finish-auction.use-case';
import { StartAuctionUseCase } from './application/use-cases/start-auction.use-case';
import { AuctionStartedHandler } from './application/handlers/auction-started.handler';
import { AuctionScheduledHandler } from './application/handlers/auction-scheduled.handler';
import { AuctionFinishedHandler } from './application/handlers/auction-finished.handler';
import { AuctionCancelledHandler } from './application/handlers/auction-cancelled.handler';
import { AuctionCancelledEvent } from './domain/events/auction-cancelled.event';
import { AuctionFinishedEvent } from './domain/events/auction-finished.event';
import { AuctionStartedEvent } from './domain/events/auction-started.event';
import { AuctionScheduledEvent } from './domain/events/auction-scheduled.event';
import { AuctionReadRepository } from './application/read-models/auction-read.repository';
import { BidPlacedEvent } from '../bidding/domain/events/bid-placed.event';
import { BidPlacedHandler } from './application/handlers/bid-placed.handler';
import { AuctionProcessor } from './application/processors/auction.processor';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionPersistenceEntity } from './infrastructure/persistence/auction.persistence-entity';
import { AuctionReadModel } from './application/read-models/auction-read.model';
import type { EventBus } from './domain/ports/event-bus.port';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'auction-jobs',
    }),
    TypeOrmModule.forFeature([AuctionPersistenceEntity, AuctionReadModel]),
  ],
  controllers: [AuctionController],
  providers: [
    CreateAuctionUseCase,
    ScheduleAuctionUseCase,
    CancelAuctionUseCase,
    FinishAuctionUseCase,
    StartAuctionUseCase,

    AuctionProcessor,

    AuctionStartedHandler,
    AuctionScheduledHandler,
    AuctionFinishedHandler,
    AuctionCancelledHandler,
    BidPlacedHandler,

    AuctionReadRepository,
    {
      provide: AUCTION_REPOSITORY,
      useClass: AuctionRepository,
    },
  ],
})
export class AuctionModule implements OnModuleInit {
  constructor(
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
    private readonly scheduledHandler: AuctionScheduledHandler,
    private readonly startedHandler: AuctionStartedHandler,
    private readonly finishedHandler: AuctionFinishedHandler,
    private readonly cancelledHandler: AuctionCancelledHandler,
    private readonly bidPlacedHandler: BidPlacedHandler,
  ) {}
  onModuleInit() {
    this.eventBus.subscribe(
      AuctionScheduledEvent.name,
      async (event: AuctionScheduledEvent) =>
        this.scheduledHandler.handle(event),
    );

    this.eventBus.subscribe(
      AuctionStartedEvent.name,
      async (event: AuctionStartedEvent) => this.startedHandler.handle(event),
    );

    this.eventBus.subscribe(
      AuctionFinishedEvent.name,
      async (event: AuctionFinishedEvent) => this.finishedHandler.handle(event),
    );

    this.eventBus.subscribe(
      AuctionCancelledEvent.name,
      async (event: AuctionCancelledEvent) =>
        this.cancelledHandler.handle(event),
    );

    this.eventBus.subscribe(
      BidPlacedEvent.name,
      async (event: BidPlacedEvent) => this.bidPlacedHandler.handle(event),
    );
  }
}
