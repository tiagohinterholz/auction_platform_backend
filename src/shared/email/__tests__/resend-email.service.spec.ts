import { Resend } from 'resend';
import { ResendEmailService } from '../resend-email.service';

// Resend is a paid third-party API that delivers real e-mail - the one
// boundary here that can only be faked in tests.
jest.mock('resend', () => ({ Resend: jest.fn() }));

describe('ResendEmailService', () => {
  const send = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (Resend as unknown as jest.Mock).mockImplementation(() => ({
      emails: { send },
    }));
  });

  it('creates the client with the given API key', () => {
    new ResendEmailService('re_test_key', 'no-reply@x');

    expect(Resend).toHaveBeenCalledWith('re_test_key');
  });

  it('sends the message with sender, recipient list, subject and body', async () => {
    send.mockResolvedValue({ data: { id: 'email-1' }, error: null });
    const service = new ResendEmailService('re_test_key', 'no-reply@x');

    await service.send('ana@x.com', 'Bem-vindo', 'Olá Ana');

    expect(send).toHaveBeenCalledWith({
      from: 'no-reply@x',
      to: ['ana@x.com'],
      subject: 'Bem-vindo',
      text: 'Olá Ana',
    });
  });

  it('throws when Resend answers with an error', async () => {
    send.mockResolvedValue({
      data: null,
      error: { message: 'Invalid API key' },
    });
    const service = new ResendEmailService('re_test_key', 'no-reply@x');

    await expect(service.send('ana@x.com', 's', 'b')).rejects.toThrow(
      'Resend failed: Invalid API key',
    );
  });
});
