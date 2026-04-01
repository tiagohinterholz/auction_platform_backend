import { DomainEvent } from './domain-event';

export class UserCreated implements DomainEvent<
  'UserCreated',
  {
    id: string;
    name: string;
    email: string;
    cpf: string;
  }
> {
  readonly type = 'UserCreated' as const;
  readonly occurredAt: string;
  readonly payload: {
    id: string;
    name: string;
    email: string;
    cpf: string;
  };

  constructor(props: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    credits: 0;
  }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
  name: 'UserCreated';
}
