import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ConsoleEmailService } from '../console-email.service';
import { EmailModule } from '../email.module';
import { MailpitEmailService } from '../mailpit-email.service';
import { ResendEmailService } from '../resend-email.service';
import { EMAIL_SERVICE } from '../token';

// Builds the real EmailModule with a hand-made config instead of the .env,
// so each test pins which adapter the factory has to pick.
function compileWith(config: Record<string, string>) {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        ignoreEnvFile: true,
        load: [() => config],
      }),
      EmailModule,
    ],
  }).compile();
}

describe('EmailModule', () => {
  it.each([
    ['console', {}, ConsoleEmailService],
    [
      'mailpit',
      { MAILPIT_SMTP_HOST: 'mailpit', MAILPIT_SMTP_PORT: '1025' },
      MailpitEmailService,
    ],
    ['resend', { RESEND_API_KEY: 're_test_key' }, ResendEmailService],
  ])('provides the %s adapter', async (provider, extra, AdapterClass) => {
    const moduleRef = await compileWith({
      EMAIL_PROVIDER: provider,
      ...extra,
    });

    expect(moduleRef.get(EMAIL_SERVICE)).toBeInstanceOf(AdapterClass);
  });

  it('falls back to Mailpit when EMAIL_PROVIDER is not set', async () => {
    const moduleRef = await compileWith({});

    expect(moduleRef.get(EMAIL_SERVICE)).toBeInstanceOf(MailpitEmailService);
  });

  it('refuses to start with resend but no RESEND_API_KEY', async () => {
    await expect(compileWith({ EMAIL_PROVIDER: 'resend' })).rejects.toThrow(
      'RESEND_API_KEY',
    );
  });
});
