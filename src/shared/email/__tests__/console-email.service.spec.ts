import { Logger } from '@nestjs/common';
import { ConsoleEmailService } from '../console-email.service';
import type { EmailServicePort } from '../email-service.port';

describe('ConsoleEmailService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs the recipient and subject instead of sending anything', async () => {
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    // Typed as the port: callers always pass the body, even if this adapter ignores it.
    const service: EmailServicePort = new ConsoleEmailService();

    await service.send('ana@x.com', 'Bem-vindo', 'Olá Ana');

    expect(log).toHaveBeenCalledWith('[email] to=ana@x.com subject=Bem-vindo');
  });
});
