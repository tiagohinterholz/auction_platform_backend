import { createTransport } from 'nodemailer';
import { MailpitEmailService } from '../mailpit-email.service';

jest.mock('nodemailer', () => ({ createTransport: jest.fn() }));

describe('MailpitEmailService', () => {
  const sendMail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createTransport as jest.Mock).mockReturnValue({ sendMail });
  });

  it('opens the SMTP transport with the given host and port', () => {
    new MailpitEmailService('mailpit', 1025, 'no-reply@x');

    expect(createTransport).toHaveBeenCalledWith({
      host: 'mailpit',
      port: 1025,
      secure: false,
    });
  });

  it('sends the message with sender, recipient, subject and body', async () => {
    sendMail.mockResolvedValue({});
    const service = new MailpitEmailService('mailpit', 1025, 'no-reply@x');

    await service.send('ana@x.com', 'Bem-vindo', 'Olá Ana');

    expect(sendMail).toHaveBeenCalledWith({
      from: 'no-reply@x',
      to: 'ana@x.com',
      subject: 'Bem-vindo',
      text: 'Olá Ana',
    });
  });

  it('propagates SMTP failures', async () => {
    sendMail.mockRejectedValue(new Error('connection refused'));
    const service = new MailpitEmailService('mailpit', 1025, 'no-reply@x');

    await expect(service.send('ana@x.com', 's', 'b')).rejects.toThrow(
      'connection refused',
    );
  });
});
