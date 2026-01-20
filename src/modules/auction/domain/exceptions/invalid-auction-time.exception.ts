import { DomainException } from './domain-exception';

export class InvalidAuctionTimeException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAuctionTimeException';
  }
}
