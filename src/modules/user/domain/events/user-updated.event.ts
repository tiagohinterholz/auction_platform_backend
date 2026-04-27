import { DomainEvent } from './domain-event';

export class UserUpdated implements DomainEvent<
  'UserUpdated',
  {
    id: string;
    name: string;
    email: string;
    cpf: string;
  }
> {
  readonly type = 'UserUpdated' as const;
  readonly occurredAt: string;
  readonly payload: {
    id: string;
    name: string;
    email: string;
    cpf: string;
  };

  constructor(props: { id: string; name: string; email: string; cpf: string }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
  name: 'UserUpdated';
}
