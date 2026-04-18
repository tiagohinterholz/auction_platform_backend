import { AuctionStatus } from './enums/auction-status.enum';
import { InvalidAuctionTransitionException } from './exceptions/invalid-auction-transition.exception';
import { InvalidAuctionTimeException } from './exceptions/invalid-auction-time.exception';
import { DomainEvent } from './events/domain-event';
import { AuctionScheduledEvent } from './events/auction-scheduled.event';
import { AuctionStartedEvent } from './events/auction-started.event';
import { AuctionFinishedEvent } from './events/auction-finished.event';
import { AuctionCancelledEvent } from './events/auction-cancelled.event';
import { AuctionExtendedEvent } from './events/auction-extended.event';

type AuctionProps = {
  id: string;
  title: string;
  startingPrice: number; // cents
  minimumIncrement: number; // cents
  startTime?: string; // ISO
  endTime?: string; // ISO
  status: AuctionStatus;
  images: string[];
};

export class Auction {
  private props: AuctionProps;
  private domainEvents: DomainEvent[] = [];

  private constructor(props: AuctionProps) {
    this.props = props;
  }

  getId(): string {
    return this.props.id;
  }

  getTitle(): string {
    return this.props.title;
  }

  getStatus(): AuctionStatus {
    return this.props.status;
  }

  getStartTime(): string | undefined {
    return this.props.startTime;
  }

  getEndTime(): string | undefined {
    return this.props.endTime;
  }

  getStartingPrice(): number {
    return this.props.startingPrice;
  }

  getMinimumIncrement(): number {
    return this.props.minimumIncrement;
  }

  getImages(): string[] {
    return this.props.images;
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  applyAntiSniping(now: Date): void {
    if (this.props.status !== AuctionStatus.ACTIVE) return;
    if (!this.props.endTime) return;
    const end = new Date(this.props.endTime);
    const diffInSeconds = (end.getTime() - now.getTime()) / 1000;
    if (diffInSeconds > 0 && diffInSeconds <= 30) {
      const newEnd = new Date(end.getTime() + 60 * 1000);
      this.props.endTime = newEnd.toISOString();

      this.domainEvents.push(
        new AuctionExtendedEvent({
          auctionId: this.props.id,
          newEndTime: this.props.endTime,
        }),
      );
    }
  }

  static create(params: {
    id: string;
    title: string;
    startingPrice: number;
    minimumIncrement: number;
    images: string[];
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
      status: AuctionStatus.CREATED,
      images: params.images,
    });
  }

  static restore(props: AuctionProps): Auction {
    return new Auction(props);
  }

  schedule(params: { startTime: string; endTime: string; now: Date }): void {
    this.assertTransition(AuctionStatus.CREATED, AuctionStatus.SCHEDULED);

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

    this.domainEvents.push(
      new AuctionScheduledEvent({
        auctionId: this.props.id,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        startingPrice: this.props.startingPrice,
        minimumIncrement: this.props.minimumIncrement,
      }),
    );
  }

  start(params: { now: Date }): void {
    this.assertTransition(AuctionStatus.SCHEDULED, AuctionStatus.ACTIVE);

    if (!this.props.startTime)
      throw new InvalidAuctionTimeException('startTime is missing');
    const start = new Date(this.props.startTime);
    if (params.now < start)
      throw new InvalidAuctionTimeException('cannot start before startTime');

    this.props.status = AuctionStatus.ACTIVE;

    this.domainEvents.push(
      new AuctionStartedEvent({
        auctionId: this.props.id,
        startingPrice: this.props.startingPrice,
        minimumIncrement: this.props.minimumIncrement,
        startedAt: params.now.toISOString(),
      }),
    );
  }

  finish(params: { now: Date }): void {
    this.assertTransition(AuctionStatus.ACTIVE, AuctionStatus.FINISHED);

    if (!this.props.endTime)
      throw new InvalidAuctionTimeException('endTime is missing');
    const end = new Date(this.props.endTime);
    if (params.now < end)
      throw new InvalidAuctionTimeException('cannot finish before endTime');

    this.props.status = AuctionStatus.FINISHED;

    this.domainEvents.push(
      new AuctionFinishedEvent({
        auctionId: this.props.id,
        finishedAt: params.now.toISOString(),
      }),
    );
  }

  cancel(params: { now: Date; reason?: string }): void {
    const from = this.props.status;
    const allowed = [
      AuctionStatus.CREATED,
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

    this.domainEvents.push(
      new AuctionCancelledEvent({
        auctionId: this.props.id,
        cancelledAt: params.now.toISOString(),
        reason: params.reason,
      }),
    );
  }

  private assertTransition(from: AuctionStatus, to: AuctionStatus): void {
    if (this.props.status !== from) {
      throw new InvalidAuctionTransitionException(this.props.status, to);
    }
  }
}
export { AuctionStatus };
