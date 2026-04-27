import { randomUUID } from 'crypto';
import { DomainEvent } from './events/domain-event';
import { UserCreated } from './events/user-created.event';
import { UserUpdated } from './events/user-updated.event';
import { UserDeleted } from './events/user-deleted.event';
import { UserRole } from './enums/user-role.enum';

export type UserProps = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  passwordHash: string;
  role: UserRole;
};

export class User {
  private domainEvents: DomainEvent[] = [];
  private constructor(private props: UserProps) {}

  static create({
    name,
    email,
    cpf,
    passwordHash,
    role,
  }: {
    name: string;
    email: string;
    cpf: string;
    passwordHash: string;
    role: UserRole;
  }): User {
    const id = randomUUID();

    const user = new User({
      id,
      name,
      email,
      cpf,
      passwordHash,
      role,
    });

    user.domainEvents.push(
      new UserCreated({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        cpf: user.getCpf(),
      }),
    );
    return user;
  }

  update(props: Partial<Omit<UserProps, 'id' | 'cpf'>>): void {
    if (props.name) this.props.name = props.name;
    if (props.email) this.props.email = props.email;

    this.domainEvents.push(
      new UserUpdated({
        id: this.props.id,
        name: this.props.name,
        email: this.props.email,
        cpf: this.props.cpf,
      }),
    );
  }

  delete(): void {
    this.domainEvents.push(
      new UserDeleted({
        id: this.props.id,
      }),
    );
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

  getCpf(): string {
    return this.props.cpf;
  }

  getPasswordHash(): string {
    return this.props.passwordHash;
  }

  getRole(): UserRole {
    return this.props.role;
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}
