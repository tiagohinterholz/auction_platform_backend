import { Logger } from '@nestjs/common';
import { EmailServicePort } from './email-service.port';

export class ConsoleEmailService implements EmailServicePort {
  private readonly logger = new Logger(ConsoleEmailService.name);

  send(to: string, subject: string): Promise<void> {
    this.logger.log(`[email] to=${to} subject=${subject}`);
    return Promise.resolve();
  }
}
