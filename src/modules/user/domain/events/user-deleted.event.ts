import { DomainEvent } from './domain-event';

export class UserDeleted implements DomainEvent<
  'UserDeleted',
  {
    id: string;
  }
> {
  readonly type = 'UserDeleted' as const;
  readonly occurredAt: string;
  readonly payload: {
    id: string;
  };

  constructor(props: { id: string }) {
    this.occurredAt = new Date().toISOString();
    this.payload = props;
  }
  name: 'UserDeleted';
}
