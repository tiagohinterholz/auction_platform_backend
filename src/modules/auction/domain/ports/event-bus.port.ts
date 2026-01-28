import { DomainEvent } from '../../domain/events/domain-event';

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;

  subscribe(
    eventName: string,
    handler: (event: DomainEvent) => Promise<void>,
  ): void;
}
