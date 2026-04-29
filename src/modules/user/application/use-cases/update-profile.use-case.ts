import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user-repository.port';
import { USER_REPOSITORY } from '../../domain/ports/tokens';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    input: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (input.email && input.email !== user.getEmail()) {
      const emailExists = await this.userRepository.findByEmail(input.email);
      if (emailExists) {
        throw new BadRequestException('Email already in use');
      }
    }

    user.update({
      name: input.name,
      email: input.email,
    });

    await this.userRepository.update(user);

    return new UserResponseDto({
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      role: user.getRole(),
    });
  }
}
