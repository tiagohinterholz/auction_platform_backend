import { DomainEvent } from './domain-event';

export class CreditsAdded implements DomainEvent<
  'CreditsAdded',
  {
    userId: string;
    amount: number;
    newTotal: number;
  }
> {
  readonly name = 'CreditsAdded' as const;
  readonly occurredAt: string;
  readonly payload: {
    userId: string;
    amount: number;
    newTotal: number;
  };

  constructor(props: { userId: string; amount: number; newTotal: number }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
}
