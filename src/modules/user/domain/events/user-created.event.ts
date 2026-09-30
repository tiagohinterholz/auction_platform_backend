import { DomainEvent } from '../../../../shared/events/domain-event';

export class UserCreated implements DomainEvent<
  'UserCreated',
  {
    id: string;
    name: string;
    email: string;
    cpf: string;
  }
> {
  readonly name = 'UserCreated' as const;
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
}
