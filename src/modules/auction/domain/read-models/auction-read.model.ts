export type AuctionReadModel = {
  id: string;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';
  startingPrice: number;
  minimumIncrement: number;
};
