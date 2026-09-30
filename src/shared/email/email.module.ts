import { Global, Module } from '@nestjs/common';
import { EMAIL_SERVICE } from './token';
import { ConfigService } from '@nestjs/config';
import { ConsoleEmailService } from './console-email.service';
import { MailpitEmailService } from './mailpit-email.service';
import { ResendEmailService } from './resend-email.service';

@Global()
@Module({
  providers: [
    {
      provide: EMAIL_SERVICE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const from = config.get<string>(
          'EMAIL_FROM',
          'no-reply@auction-platform.local',
        );
        if (config.get('EMAIL_PROVIDER') === 'console')
          return new ConsoleEmailService();
        if (config.get('EMAIL_PROVIDER') === 'resend')
          return new ResendEmailService(
            config.getOrThrow<string>('RESEND_API_KEY'),
            from,
          );

        return new MailpitEmailService(
          config.get<string>('MAILPIT_SMTP_HOST', 'localhost'),
          Number(config.get('MAILPIT_SMTP_PORT', 1025)),
          from,
        );
      },
    },
  ],
  exports: [EMAIL_SERVICE],
})
export class EmailModule {}
