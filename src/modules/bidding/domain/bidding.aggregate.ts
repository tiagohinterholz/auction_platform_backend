import { DomainEvent } from './events/domain-event';
import { InvalidBidPlaced } from './exceptions/invalid-bid-placed.exception';
import { BidPlacedEvent } from './events/bid-placed.event';

type BiddingProps = {
  id: string;
  auctionId: string;
  currentPrice: number;
  minimumIncrement: number;
  lastBidderId?: string;
  lastBidAmount?: number;
  lastBidAt?: string;
};

export class Bidding {
  private props: BiddingProps;
  private domainEvents: DomainEvent[] = [];

  private constructor(props: BiddingProps) {
    this.props = props;
  }

  static open(params: {
    id: string;
    auctionId: string;
    startingPrice: number;
    minimumIncrement: number;
  }): Bidding {
    return new Bidding({
      id: params.id,
      auctionId: params.auctionId,
      currentPrice: params.startingPrice,
      minimumIncrement: params.minimumIncrement,
    });
  }

  static restore(props: BiddingProps): Bidding {
    return new Bidding(props);
  }

  placeBid(params: { bidderId: string; amount: number; now: Date }): void {
    if (params.amount <= 0) {
      throw new InvalidBidPlaced('Amount must be positive.');
    }

    const minAllowed = this.props.currentPrice + this.props.minimumIncrement;
    if (params.amount <= minAllowed) {
      throw new InvalidBidPlaced(
        'Amount must be greater than the current price plus minimum increment.',
      );
    }

    this.props.currentPrice = params.amount;
    this.props.lastBidderId = params.bidderId;
    this.props.lastBidAmount = params.amount;
    this.props.lastBidAt = params.now.toISOString();

    this.domainEvents.push(
      new BidPlacedEvent({
        bidId: this.props.id,
        auctionId: this.props.auctionId,
        bidderId: params.bidderId,
        amount: params.amount,
      }),
    );
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  getId() {
    return this.props.id;
  }

  getAuctionId() {
    return this.props.auctionId;
  }

  getCurrentPrice() {
    return this.props.currentPrice;
  }

  getMinimumIncrement() {
    return this.props.minimumIncrement;
  }

  getLastBidderId() {
    return this.props.lastBidderId;
  }

  getLastBidAmount() {
    return this.props.lastBidAmount;
  }

  getLastBidAt() {
    return this.props.lastBidAt;
  }
}
