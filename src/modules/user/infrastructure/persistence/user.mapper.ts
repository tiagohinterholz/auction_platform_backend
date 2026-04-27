import { User } from '../../domain/user.aggregate';
import { UserPersistenceEntity } from './user.persistence-entity';

export class UserMapper {
  static toPersistence(user: User): UserPersistenceEntity {
    const entity = new UserPersistenceEntity();
    entity.id = user.getId();
    entity.name = user.getName();
    entity.email = user.getEmail();
    entity.passwordHash = user.getPasswordHash();
    entity.cpf = user.getCpf();
    entity.role = user.getRole();
    return entity;
  }

  static toDomain(entity: UserPersistenceEntity): User {
    return User.restore({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      passwordHash: entity.passwordHash,
      cpf: entity.cpf,
      role: entity.role,
    });
  }
}
