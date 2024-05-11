export interface DocumentFile {
  id: string;
  description: string;
  url: string;
}

export interface Wallet {
  address: string;
}

export interface Milestone {
  id?: string;
  name: string;
  description: string;
  location: string;
  date: Date;
  docs?: DocumentFile[];
}

export enum DealStatus {
  Proposal = 'proposal',
  Confirmed = 'confirmed',
  Finished = 'finished',
  Cancelled = 'cancelled',
}

export interface Deal {
  id: string;
  name: string;
  description: string;
  contractId: number;
  nftID: number;
  mintTxHash: string;
  origin: string;
  destination: string;
  presentation: string;
  size: string;
  variety: string;
  shippingStartDate: Date;
  expectedShippingEndDate: Date;
  docs: DocumentFile[];
  currentMilestone: number;
  milestones: Milestone[];
  investmentAmount: number;
  revenue: number;
  netBalance: number;
  roi: number;
  carbonFootprint: string;
  whitelist: Wallet[];
  status: DealStatus;
  buyerId: string;
  supplierId: string;
  proposalBuyerEmail: string;
  proposalSupplierEmail: string;
  buyerConfirmed: boolean;
  supplierConfirmed: boolean;
  duration: string;
  daysLeft: number;
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
