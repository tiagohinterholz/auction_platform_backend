import { DomainEvent } from './domain-event';

// Handlers may be sync (e.g. a WebSocket emit) or async (DB writes); the bus
// awaits either, so subscribers don't need a fake `async` to fit the type.
export type EventHandler = (event: DomainEvent) => void | Promise<void>;

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;

  subscribe(eventName: string, handler: EventHandler): void;
}
