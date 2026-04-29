import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPersistenceEntity } from './infrastructure/persistence/user.persistence-entity';
import { USER_REPOSITORY } from './domain/ports/tokens';
import { UserRepository } from './infrastructure/repository/user.repository';
import { UserController } from './presentation/controllers/user.controller';

// Use Cases
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserPersistenceEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    GetProfileUseCase,
    UpdateProfileUseCase,
    ListUsersUseCase,
    DeleteUserUseCase,
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
