import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from '../../../user/domain/user.aggregate';
import { UserRole } from '../../../user/domain/enums/user-role.enum';
import type { IUserRepository } from '../../../user/domain/ports/user-repository.port';
import { USER_REPOSITORY } from '../../../user/domain/ports/tokens';
import type { IPasswordService } from '../../domain/ports/password.service.interface';
import type { ITokenService } from '../../domain/ports/token.service.interface';
import type { IRefreshTokenRepository } from '../../domain/ports/refresh-token.interface';
import {
  PASSWORD_SERVICE_TOKEN,
  TOKEN_SERVICE_TOKEN,
  REFRESH_TOKEN_REPOSITORY,
} from '../../domain/ports/auth.tokens';
import { RegisterDto } from '../dtos/register.dto';
import type { AuthResponseDto } from '../dtos/auth-response.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_SERVICE_TOKEN)
    private readonly passwordService: IPasswordService,
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: ITokenService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(input: RegisterDto): Promise<AuthResponseDto> {
    const userExists = await this.userRepository.findByEmail(input.email);
    if (userExists) throw new BadRequestException('Email already in use');

    const passwordHash = await this.passwordService.hash(input.password);

    const user = User.create({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      passwordHash,
      role: UserRole.USER,
    });

    await this.userRepository.create(user);

    const jti = randomUUID();
    const payload = {
      sub: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
      jti,
    };

    const accessToken = this.tokenService.signAccessToken(payload);
    const refreshToken = this.tokenService.signRefreshToken(payload);

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    await this.refreshTokenRepository.save({
      jti,
      userId: user.getId(),
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        role: user.getRole(),
      },
    };
  }
}
