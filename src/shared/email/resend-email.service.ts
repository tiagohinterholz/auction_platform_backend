import { Resend } from 'resend';
import { EmailServicePort } from './email-service.port';

export class ResendEmailService implements EmailServicePort {
  private readonly client: Resend;

  constructor(
    apiKey: string,
    private readonly from: string,
  ) {
    this.client = new Resend(apiKey);
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    const { error } = await this.client.emails.send({
      from: this.from,
      to: [to],
      subject,
      text: body,
    });
    if (error) throw new Error(`Resend failed: ${error.message}`);
  }
}
