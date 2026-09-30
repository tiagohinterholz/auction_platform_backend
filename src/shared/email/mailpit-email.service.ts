import { createTransport, type Transporter } from 'nodemailer';
import { EmailServicePort } from './email-service.port';

export class MailpitEmailService implements EmailServicePort {
  private readonly transporter: Transporter;

  constructor(
    host: string,
    port: number,
    private readonly from: string,
  ) {
    this.transporter = createTransport({ host, port, secure: false });
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      text: body,
    });
  }
}
