import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface rec_0 {
  id: string;
  status: string;
  destination: string;
  expectedShippingEndDate: string;
  docs: Array<rec_1>;
  quality: string;
  offerUnitPrice: number;
  name: string;
  origin: string;
  transport: string;
  description: string;
  portOfOrigin: string;
  nftID: number;
  currentMilestone: number;
  quantity: number;
  mintTxHash: string;
  presentation: string;
  shippingStartDate: string;
  variety: string;
  portOfDestination: string;
  milestones: Array<rec_2>;
}
export interface rec_1 {
  _id: string;
  url: string;
  description: string;
}
export interface rec_10 {
  id: string;
  docs: Array<rec_11>;
  fundsDistribution: number;
}
export interface rec_11 {
  _id: string;
  url: string;
  description: string;
}
export interface rec_12 {
  id: string;
  docs: Array<rec_13>;
  fundsDistribution: number;
}
export interface rec_13 {
  _id: string;
  url: string;
  description: string;
}
export interface rec_14 {
  activityType: string;
  createdAt: string;
  description: string;
  txHash: string;
}
export interface rec_15 {
  activityType: string;
  createdAt: string;
  description: string;
  txHash: string;
}
export interface rec_2 {
  id: string;
  docs: Array<rec_3>;
  fundsDistribution: number;
}
export interface rec_3 {
  _id: string;
  url: string;
  description: string;
}
export interface rec_4 {
  id: string;
  status: string;
  destination: string;
  expectedShippingEndDate: string;
  docs: Array<rec_5>;
  quality: string;
  offerUnitPrice: number;
  name: string;
  origin: string;
  transport: string;
  description: string;
  portOfOrigin: string;
  nftID: number;
  currentMilestone: number;
  quantity: number;
  mintTxHash: string;
  presentation: string;
  shippingStartDate: string;
  variety: string;
  portOfDestination: string;
  milestones: Array<rec_6>;
}
export interface rec_5 {
  _id: string;
  url: string;
  description: string;
}
export interface rec_6 {
  id: string;
  docs: Array<rec_7>;
  fundsDistribution: number;
}
export interface rec_7 {
  _id: string;
  url: string;
  description: string;
}
export interface rec_8 {
  id: string;
  status: string;
  destination: string;
  expectedShippingEndDate: string;
  docs: Array<rec_9>;
  quality: string;
  offerUnitPrice: number;
  name: string;
  origin: string;
  transport: string;
  description: string;
  portOfOrigin: string;
  nftID: number;
  currentMilestone: number;
  quantity: number;
  mintTxHash: string;
  presentation: string;
  shippingStartDate: string;
  variety: string;
  portOfDestination: string;
  milestones: Array<rec_10>;
}
export interface rec_9 {
  _id: string;
  url: string;
  description: string;
}
export interface _SERVICE {
  createShipment: ActorMethod<[rec_8, string], undefined>;
  createShipmentActivity: ActorMethod<[string, rec_15, string], undefined>;
  getShipmentActivity: ActorMethod<[string], Array<rec_14>>;
  getShipmentDetails: ActorMethod<[string], rec_4>;
  getShipmentsList: ActorMethod<[], Array<rec_0>>;
  getVersion: ActorMethod<[], string>;
  updateMilestone: ActorMethod<[string, rec_12, string], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
