import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { AuctionGateway } from './presentation/gateway/auction.gateway';
import { EVENT_BUS } from '../auction/domain/ports/tokens';
import type { EventBus } from '../auction/domain/ports/event-bus.port';
import { BidPlacedEvent } from '../bidding/domain/events/bid-placed.event';
import { AuctionExtendedEvent } from '../auction/domain/events/auction-extended.event';
import { AuctionStartedEvent } from '../auction/domain/events/auction-started.event';
import { AuctionFinishedEvent } from '../auction/domain/events/auction-finished.event';
import { AuctionCancelledEvent } from '../auction/domain/events/auction-cancelled.event';
import { AuctionScheduledEvent } from '../auction/domain/events/auction-scheduled.event';

@Module({
  providers: [AuctionGateway],
  exports: [AuctionGateway],
})
export class NotificationsModule implements OnModuleInit {
  constructor(
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
    private readonly gateway: AuctionGateway,
  ) {}

  onModuleInit() {
    this.eventBus.subscribe(
      BidPlacedEvent.name,
      async (event: BidPlacedEvent) => {
        this.gateway.server
          .to(`auction:${event.payload.auctionId}`)
          .emit('bidPlaced', event.payload);

        console.log(
          `[WS] Lance enviado para sala auction:${event.payload.auctionId}`,
        );
      },
    );

    this.eventBus.subscribe(
      AuctionExtendedEvent.name,
      async (event: AuctionExtendedEvent) => {
        this.gateway.server
          .to(`auction:${event.payload.auctionId}`)
          .emit('auctionExtended', event.payload);

        console.log(
          `[WS] Leilão estendido para sala auction:${event.payload.auctionId}`,
        );
      },
    );

    this.eventBus.subscribe(
      AuctionStartedEvent.name,
      async (event: AuctionStartedEvent) => {
        this.gateway.server
          .to(`auction:${event.payload.auctionId}`)
          .emit('auctionStarted', event.payload);
        console.log(`[WS] Leilão iniciado: ${event.payload.auctionId}`);
      },
    );

    this.eventBus.subscribe(
      AuctionFinishedEvent.name,
      async (event: AuctionFinishedEvent) => {
        this.gateway.server
          .to(`auction:${event.payload.auctionId}`)
          .emit('auctionFinished', event.payload);
        console.log(`[WS] Leilão finalizado: ${event.payload.auctionId}`);
      },
    );

    this.eventBus.subscribe(
      AuctionCancelledEvent.name,
      async (event: AuctionCancelledEvent) => {
        this.gateway.server
          .to(`auction:${event.payload.auctionId}`)
          .emit('auctionCancelled', event.payload);
        console.log(`[WS] Leilão cancelado: ${event.payload.auctionId}`);
      },
    );

    this.eventBus.subscribe(
      AuctionScheduledEvent.name,
      async (event: AuctionScheduledEvent) => {
        this.gateway.server
          .to(`auction:${event.payload.auctionId}`)
          .emit('auctionScheduled', event.payload);
        console.log(`[WS] Leilão agendado: ${event.payload.auctionId}`);
      },
    );
  }
}
