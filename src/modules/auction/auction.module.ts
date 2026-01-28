import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { AUCTION_REPOSITORY, EVENT_BUS } from './domain/ports/tokens';
import { AuctionRepository } from './infrastructure/repository/auction.repository';
import { AuctionController } from './presentation/controllers/auction.controller';
import { CreateAuctionUseCase } from './application/use-cases/create-auction.use-case';
import { ScheduleAuctionUseCase } from './application/use-cases/schedule-auction.use-case';
import { CancelAuctionUseCase } from './application/use-cases/cancel-auction.use-case';
import { FinishAuctionUseCase } from './application/use-cases/finish-auction.use-case';
import { InMemoryEventBus } from 'src/shared/events/in-memory-event-bus';
import { AuctionStartedHandler } from './application/handlers/auction-started.handler';
import { AuctionScheduledHandler } from './application/handlers/auction-scheduled.handler';
import { AuctionFinishedHandler } from './application/handlers/auction-finished.handler';
import { AuctionCancelledHandler } from './application/handlers/auction-cancelled.handler';
import { AuctionCancelledEvent } from './domain/events/auction-cancelled.event';
import { AuctionFinishedEvent } from './domain/events/auction-finished.event';
import { AuctionStartedEvent } from './domain/events/auction-started.event';
import { AuctionScheduledEvent } from './domain/events/auction-scheduled.event';
import { AuctionReadRepository } from './application/read-models/auction-read.repository';

@Module({
  controllers: [AuctionController],
  providers: [
    CreateAuctionUseCase,
    ScheduleAuctionUseCase,
    CancelAuctionUseCase,
    FinishAuctionUseCase,

    AuctionStartedHandler,
    AuctionScheduledHandler,
    AuctionFinishedHandler,
    AuctionCancelledHandler,

    AuctionReadRepository,
    {
      provide: AUCTION_REPOSITORY,
      useClass: AuctionRepository,
    },
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus,
    },
  ],
})
export class AuctionModule implements OnModuleInit {
  constructor(
    @Inject(EVENT_BUS)
    private readonly eventBus: InMemoryEventBus,
    private readonly scheduledHandler: AuctionScheduledHandler,
    private readonly startedHandler: AuctionStartedHandler,
    private readonly finishedHandler: AuctionFinishedHandler,
    private readonly cancelledHandler: AuctionCancelledHandler,
  ) {}
  onModuleInit() {
    this.eventBus.subscribe(
      AuctionScheduledEvent.name,
      (event: AuctionScheduledEvent) => this.scheduledHandler.handle(event),
    );

    this.eventBus.subscribe(
      AuctionStartedEvent.name,
      (event: AuctionStartedEvent) => this.startedHandler.handle(event),
    );

    this.eventBus.subscribe(
      AuctionFinishedEvent.name,
      (event: AuctionFinishedEvent) => this.finishedHandler.handle(event),
    );

    this.eventBus.subscribe(
      AuctionCancelledEvent.name,
      (event: AuctionCancelledEvent) => this.cancelledHandler.handle(event),
    );
  }
}
