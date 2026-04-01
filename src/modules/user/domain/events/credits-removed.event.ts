import { DomainEvent } from './domain-event';

export class CreditsRemoved implements DomainEvent<
  'CreditsRemoved',
  {
    userId: string;
    amount: number;
    newTotal: number;
  }
> {
  readonly name = 'CreditsRemoved' as const;
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
