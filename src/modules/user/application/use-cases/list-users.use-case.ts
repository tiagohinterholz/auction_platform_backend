import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user-repository.port';
import { USER_REPOSITORY } from '../../domain/ports/tokens';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();

    return users.map(
      (user) =>
        new UserResponseDto({
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          role: user.getRole(),
        }),
    );
  }
}
