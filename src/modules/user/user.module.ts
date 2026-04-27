import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPersistenceEntity } from './infrastructure/persistence/user.persistence-entity';
import { USER_REPOSITORY } from './domain/ports/tokens';
import { UserRepository } from './infrastructure/repository/user.repository';
import { UserController } from './presentation/controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserPersistenceEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    // Adicione os Use Cases aqui depois que criá-los
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
