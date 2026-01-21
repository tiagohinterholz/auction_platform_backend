import { DomainEvent } from '../../domain/events/domain-event';
import { EventBus } from '../../domain/ports/event-bus.port';

export class InMemoryEventBus implements EventBus {
  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      console.log('[EVENT]', event.name, event.payload);
    }
  }
}
