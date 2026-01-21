import { AuctionStatus } from './enums/auction-status.enum';
import { InvalidAuctionTransitionException } from './exceptions/invalid-auction-transition.exception';
import { InvalidAuctionTimeException } from './exceptions/invalid-auction-time.exception';
import { DomainEvent } from './events/domain-event';
import { AuctionScheduledEvent } from './events/auction-scheduled.event';
import { AuctionStartedEvent } from './events/auction-started.event';
import { AuctionFinishedEvent } from './events/auction-finished.event';
import { AuctionCancelledEvent } from './events/auction-cancelled.event';

type AuctionProps = {
  id: string;
  title: string;
  startingPrice: number; // cents
  minimumIncrement: number; // cents
  startTime?: string; // ISO
  endTime?: string; // ISO
  status: AuctionStatus;
};

export class Auction {
  private props: AuctionProps;
  private domainEvents: DomainEvent[] = [];

  private constructor(props: AuctionProps) {
    this.props = props;
  }

  static create(params: {
    id: string;
    title: string;
    startingPrice: number;
    minimumIncrement: number;
  }): Auction {
    if (!params.title?.trim()) throw new Error('title is required');
    if (params.startingPrice < 0) throw new Error('startingPrice must be >= 0');
    if (params.minimumIncrement <= 0)
      throw new Error('minimumIncrement must be > 0');

    return new Auction({
      id: params.id,
      title: params.title.trim(),
      startingPrice: params.startingPrice,
      minimumIncrement: params.minimumIncrement,
      status: AuctionStatus.DRAFT,
    });
  }

  static restore(props: AuctionProps): Auction {
    return new Auction(props);
  }

  get id(): string {
    return this.props.id;
  }

  get status(): AuctionStatus {
    return this.props.status;
  }

  get startTime(): string | undefined {
    return this.props.startTime;
  }

  get endTime(): string | undefined {
    return this.props.endTime;
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  schedule(params: { startTime: string; endTime: string; now: Date }): void {
    this.assertTransition(AuctionStatus.DRAFT, AuctionStatus.SCHEDULED);

    const start = new Date(params.startTime);
    const end = new Date(params.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new InvalidAuctionTimeException(
        'startTime/endTime must be valid ISO dates',
      );
    }
    if (start >= end)
      throw new InvalidAuctionTimeException('startTime must be < endTime');
    if (start <= params.now)
      throw new InvalidAuctionTimeException('startTime must be in the future');

    this.props.startTime = start.toISOString();
    this.props.endTime = end.toISOString();
    this.props.status = AuctionStatus.SCHEDULED;

    const event: AuctionScheduledEvent = {
      name: 'AuctionScheduled',
      occurredAt: params.now.toISOString(),
      payload: {
        auctionId: this.id,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
      },
    };
    this.domainEvents.push(event);
  }

  start(params: { now: Date }): void {
    this.assertTransition(AuctionStatus.SCHEDULED, AuctionStatus.ACTIVE);

    if (!this.props.startTime)
      throw new InvalidAuctionTimeException('startTime is missing');
    const start = new Date(this.props.startTime);
    if (params.now < start)
      throw new InvalidAuctionTimeException('cannot start before startTime');

    this.props.status = AuctionStatus.ACTIVE;

    const event: AuctionStartedEvent = {
      name: 'AuctionStarted',
      occurredAt: params.now.toISOString(),
      payload: { auctionId: this.id, startedAt: params.now.toISOString() },
    };
    this.domainEvents.push(event);
  }

  finish(params: { now: Date }): void {
    this.assertTransition(AuctionStatus.ACTIVE, AuctionStatus.FINISHED);

    if (!this.props.endTime)
      throw new InvalidAuctionTimeException('endTime is missing');
    const end = new Date(this.props.endTime);
    if (params.now < end)
      throw new InvalidAuctionTimeException('cannot finish before endTime');

    this.props.status = AuctionStatus.FINISHED;

    const event: AuctionFinishedEvent = {
      name: 'AuctionFinished',
      occurredAt: params.now.toISOString(),
      payload: { auctionId: this.id, finishedAt: params.now.toISOString() },
    };
    this.domainEvents.push(event);
  }

  cancel(params: { now: Date; reason?: string }): void {
    const from = this.props.status;
    const allowed = [
      AuctionStatus.DRAFT,
      AuctionStatus.SCHEDULED,
      AuctionStatus.ACTIVE,
    ];

    if (!allowed.includes(from)) {
      throw new InvalidAuctionTransitionException(
        from,
        AuctionStatus.CANCELLED,
      );
    }

    this.props.status = AuctionStatus.CANCELLED;

    const event: AuctionCancelledEvent = {
      name: 'AuctionCancelled',
      occurredAt: params.now.toISOString(),
      payload: {
        auctionId: this.id,
        cancelledAt: params.now.toISOString(),
        reason: params.reason,
      },
    };
    this.domainEvents.push(event);
  }

  private assertTransition(from: AuctionStatus, to: AuctionStatus): void {
    if (this.props.status !== from) {
      throw new InvalidAuctionTransitionException(this.props.status, to);
    }
  }
}
