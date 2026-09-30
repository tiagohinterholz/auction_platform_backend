import { DomainEvent } from 'src/shared/events/domain-event';
import { EventBus } from 'src/shared/events/event-bus.port';

type Handler<T> = (event: T) => void | Promise<void>;

export class InMemoryEventBus implements EventBus {
  private handlers = new Map<string, Handler<any>[]>();

  subscribe(eventName: string, handler: Handler<any>) {
    const handlers = this.handlers.get(eventName) ?? [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const handlers = this.handlers.get(event.constructor.name) ?? [];
      for (const handler of handlers) {
        console.log('[EVENT]', event.name, event.payload);
        await handler(event);
      }
    }
  }
}
