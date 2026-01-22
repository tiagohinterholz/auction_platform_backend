import { DomainException } from './domain-exception';

export class InvalidBidPlaced extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBidPlacedException';
  }
}
