import { randomUUID } from 'crypto';
import { DomainEvent } from '../../../shared/events/domain-event';
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
  isActive: boolean;
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
    if (!name.trim()) throw new Error('name is required');
    if (!email.includes('@')) throw new Error('invalid e-mail');
    if (!cpf.trim() || cpf.length != 11) throw new Error('CPF Invalido');

    const id = randomUUID();
    const isActive = true;

    const user = new User({
      id,
      name,
      email,
      cpf,
      passwordHash,
      role,
      isActive,
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
    if (props.email !== undefined) {
      if (!props.email.includes('@')) throw new Error('invalid e-mail');
      this.props.email = props.email;
    }

    this.domainEvents.push(
      new UserUpdated({
        id: this.props.id,
        name: this.props.name,
        email: this.props.email,
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

  getisActive(): boolean {
    return this.props.isActive;
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}
