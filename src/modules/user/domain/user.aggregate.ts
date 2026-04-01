import { DomainEvent } from './events/domain-event';
import { UserCreated } from './events/user-created.event';
import { UserUpdated } from './events/user-updated.event';
import { UserDeleted } from './events/user-deleted.event';
import { CreditsAdded } from './events/credits-added.event';
import { CreditsRemoved } from './events/credits-removed.event';
export type UserProps = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  credits: number;
};

export class User {
  private domainEvents: DomainEvent[] = [];
  private constructor(private props: UserProps) {}

  static create({
    id,
    name,
    email,
    cpf,
  }: {
    id: string;
    name: string;
    email: string;
    cpf: string;
  }): User {
    const user = new User({
      id,
      name,
      email,
      cpf,
      credits: 0,
    });

    user.domainEvents.push(
      new UserCreated({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        cpf: user.getCpf(),
        credits: 0,
      }),
    );
    return user;
  }

  static restore(props: UserProps): User {
    return new User(props);
  }

  getId(): string {
    return this.props.id;
  }

  getName(): string {
    return this.props.name;
  }

  getEmail(): string {
    return this.props.email;
  }

  getCredits(): number {
    return this.props.credits;
  }

  getCpf(): string {
    return this.props.cpf;
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  update(props: Partial<Omit<UserProps, 'id' | 'credits' | 'cpf'>>): void {
    if (props.name) this.props.name = props.name;
    if (props.email) this.props.email = props.email;

    this.domainEvents.push(
      new UserUpdated({
        id: this.props.id,
        name: this.props.name,
        email: this.props.email,
        cpf: this.props.cpf,
        credits: 0,
      }),
    );
  }

  delete(): void {
    this.domainEvents.push(
      new UserDeleted({
        id: this.props.id,
        name: this.props.name,
        email: this.props.email,
        cpf: this.props.cpf,
        credits: 0,
      }),
    );
  }

  addCredits(amount: number): void {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.props.credits += amount;
    this.domainEvents.push(
      new CreditsAdded({
        userId: this.props.id,
        amount,
        newTotal: this.props.credits,
      }),
    );
  }
  removeCredits(amount: number): void {
    if (amount <= 0) throw new Error('Amount must be positive');
    if (this.props.credits < amount) throw new Error('Insufficient credits');
    this.props.credits -= amount;
    this.domainEvents.push(
      new CreditsRemoved({
        userId: this.props.id,
        amount,
        newTotal: this.props.credits,
      }),
    );
  }
}
