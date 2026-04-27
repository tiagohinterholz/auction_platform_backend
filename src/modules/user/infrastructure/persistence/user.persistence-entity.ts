import { Entity, Column, PrimaryColumn } from 'typeorm';
import { UserRole } from '../../domain/enums/user-role.enum';

@Entity('users')
export class UserPersistenceEntity {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  passwordHash: string;
  @Column()
  cpf: string;
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
