import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from '../user/user.module';

import {
  PASSWORD_SERVICE_TOKEN,
  TOKEN_SERVICE_TOKEN,
  REFRESH_TOKEN_REPOSITORY,
} from './domain/ports/auth.tokens';

import { RefreshTokenEntity } from './infrastructure/persistence/refresh-token.entity';

import { BcryptPasswordService } from './infrastructure/services/bcrypt-password.service';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { RefreshTokenRepository } from './infrastructure/repository/refresh-token.repository';

import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './infrastructure/strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { JwtRefreshGuard } from './presentation/guards/jwt-refresh.guard';

import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh.use-case';

import { AuthController } from './presentation/controllers/auth.controller';

@Global()
@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '15m') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: PASSWORD_SERVICE_TOKEN,
      useClass: BcryptPasswordService,
    },
    {
      provide: TOKEN_SERVICE_TOKEN,
      useClass: JwtTokenService,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRepository,
    },

    JwtStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    JwtRefreshGuard,

    RegisterUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
  ],
  exports: [JwtAuthGuard, JwtRefreshGuard],
})
export class AuthModule {}
