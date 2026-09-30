export interface EmailServicePort {
  send(to: string, subject: string, body: string): Promise<void>;
}
