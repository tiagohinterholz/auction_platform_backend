import { DomainEvent } from '../../domain/events/domain-event';

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
}
