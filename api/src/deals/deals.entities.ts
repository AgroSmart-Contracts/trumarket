export interface DocumentFile {
  id: string;
  description: string;
  url: string;
}

export interface Wallet {
  address: string;
}

export class Milestone {
  id?: string;
  description: string;
  fundsDistribution: number;
  docs?: DocumentFile[];
}

export enum DealStatus {
  Proposal = 'proposal',
  Confirmed = 'confirmed',
  Finished = 'finished',
  Cancelled = 'cancelled',
}

export class Deal {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  docs: DocumentFile[];
  carbonFootprint: string;

  // smart contract properties
  nftID: number;
  mintTxHash: string;

  // shipping properties
  contractId: number;
  contractAddress: string;
  origin: string;
  destination: string;
  portOfOrigin: string;
  portOfDestination: string;
  transport: string;
  presentation: string;
  size: string;
  variety: string;
  quality: string;
  offerUnitPrice: number;
  quantity: number;
  totalValue: number;
  shippingStartDate: Date;
  expectedShippingEndDate: Date;
  duration: string;
  daysLeft: number;

  // state properties
  currentMilestone: number;
  milestones: Milestone[];
  status: DealStatus;
  buyerConfirmed: boolean;
  supplierConfirmed: boolean;

  // financial properties
  investmentAmount: number;
  revenue: number;
  netBalance: number;
  roi: number;

  // ownership properties
  // whitelist: Wallet[];
  buyerId: string;
  supplierId: string;
  proposalBuyerEmail: string;
  proposalSupplierEmail: string;
}

export interface DealLog {
  dealId: string;
  event: string;
  args: any;
  blockNumber: number;
  blockTimestamp: Date;
  txHash: string;
  message: string;
}
