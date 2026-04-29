import { Inject, Injectable } from '@nestjs/common';
import type { IRefreshTokenRepository } from '../../domain/ports/refresh-token.interface';
import { REFRESH_TOKEN_REPOSITORY } from '../../domain/ports/auth.tokens';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(input: { jti: string }): Promise<void> {
    await this.refreshTokenRepository.revokeByJti(input.jti);
  }
}
