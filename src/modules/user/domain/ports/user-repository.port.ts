import { User } from '../user.aggregate';

export interface IUserRepository {
  create(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
  update(user: User): Promise<void>;
}
