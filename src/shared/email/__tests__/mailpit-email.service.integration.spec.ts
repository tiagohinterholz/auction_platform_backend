import { randomUUID } from 'crypto';
import { MailpitEmailService } from '../mailpit-email.service';

// Real SMTP round-trip against the Mailpit container - no mocks. Needs
// `docker compose up -d mailpit`; skipped otherwise so `npm test` stays green
// on a machine without it. Run with: MAILPIT_IT=1 npx jest mailpit
const SMTP_HOST = process.env.MAILPIT_SMTP_HOST ?? 'localhost';
const SMTP_PORT = Number(process.env.MAILPIT_SMTP_PORT ?? 1030);
const API_URL = process.env.MAILPIT_API_URL ?? 'http://localhost:8030/api/v1';

type MailpitMessage = { Subject: string; To: { Address: string }[] };

async function findBySubject(
  subject: string,
): Promise<MailpitMessage | undefined> {
  const response = await fetch(`${API_URL}/messages`);
  const { messages } = (await response.json()) as {
    messages: MailpitMessage[];
  };
  return messages.find((message) => message.Subject === subject);
}

const describeIfMailpit = process.env.MAILPIT_IT ? describe : describe.skip;

describeIfMailpit('MailpitEmailService (integration)', () => {
  it('delivers the message to the Mailpit inbox', async () => {
    // Unique subject: the inbox is shared, so the test must not pick up an
    // older message left by a previous run.
    const subject = `Bem-vindo ${randomUUID()}`;
    const service = new MailpitEmailService(SMTP_HOST, SMTP_PORT, 'no-reply@x');

    await service.send('ana@x.com', subject, 'Olá Ana');

    const delivered = await findBySubject(subject);
    expect(delivered).toBeDefined();
    expect(delivered!.To[0].Address).toBe('ana@x.com');
  });
});
