import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import {
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_SERVICE_TOKEN,
} from '../../domain/ports/auth.tokens';
import type { IRefreshTokenRepository } from '../../domain/ports/refresh-token.interface';
import type { ITokenService } from '../../domain/ports/token.service.interface';
import type { RefreshResponseDto } from '../dtos/auth-response.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: {
    sub: string;
    email: string;
    role: string;
    jti: string;
    rawRefreshToken: string;
  }): Promise<RefreshResponseDto> {
    const token = await this.refreshTokenRepository.findByJti(input.jti);
    if (!token) throw new UnauthorizedException('Invalid refresh token');
    if (token.revokedAt != null)
      throw new UnauthorizedException('Token revoked');
    if (token.expiresAt < new Date())
      throw new UnauthorizedException('Token expired');

    const isValid = await bcrypt.compare(
      input.rawRefreshToken,
      token.tokenHash,
    );
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    await this.refreshTokenRepository.revokeByJti(input.jti);

    const newJti = randomUUID();
    const payload = {
      sub: input.sub,
      email: input.email,
      role: input.role,
      jti: newJti,
    };

    const accessToken = this.tokenService.signAccessToken(payload);
    const refreshToken = this.tokenService.signRefreshToken(payload);

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    await this.refreshTokenRepository.save({
      jti: newJti,
      userId: input.sub,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }
}
