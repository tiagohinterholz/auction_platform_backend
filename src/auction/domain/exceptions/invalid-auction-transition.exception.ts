import { DomainException } from './domain-exception';
import { AuctionStatus } from '../auction-status.enum';

export class InvalidAuctionTransitionException extends DomainException {
  constructor(from: AuctionStatus, to: AuctionStatus) {
    super(`Invalid auction transition: ${from} -> ${to}`);
    this.name = 'InvalidAuctionTransitionException';
  }
}
