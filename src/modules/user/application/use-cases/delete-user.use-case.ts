import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user-repository.port';
import { USER_REPOSITORY } from '../../domain/ports/tokens';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.delete();
    await this.userRepository.delete(userId);
  }
}
