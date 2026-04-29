import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user-repository.port';
import { USER_REPOSITORY } from '../../domain/ports/tokens';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponseDto({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      role: user.getRole(),
    });
  }
}
