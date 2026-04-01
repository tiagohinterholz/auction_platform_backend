import { DomainEvent } from './domain-event';

export class UserDeleted implements DomainEvent<
  'UserDeleted',
  {
    id: string;
    name: string;
    email: string;
    cpf: string;
  }
> {
  readonly type = 'UserDeleted' as const;
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
  name: 'UserDeleted';
}
