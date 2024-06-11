import mongoose, { Schema } from 'mongoose';

export enum AccountType {
  Supplier = 'supplier',
  Buyer = 'buyer',
  Investor = 'investor',
}

export enum WalletType {
  EVM = 'evm',
}

export enum RoleType {
  REGULAR = 0,
  ADMIN = 1,
}

export class NotificationsSettings {
  assignedDeal: boolean;
  submittedDealChanges: boolean;
  confirmedDeal: boolean;
  cancelledDeal: boolean;
  completedDeal: boolean;
  // buyer
  buyerApprovedMilestone: boolean;
  buyerDeniedMilestone: boolean;
  // supplier
  supplierUploadedDocument: boolean;
  supplierDeletedDocument: boolean;
  supplierRequestedMilestoneApproval: boolean;
  supplierCancelledMilestoneApproval: boolean;
}

export class User {
  id: string;
  email: string;
  accountType: string;
  walletAddress: string;
  walletType: string;
  role: number;
  createdAt: Date;
  kycVerified: boolean;
  desktopNotifications?: NotificationsSettings;
  emailNotifications?: NotificationsSettings;
}

const NotificationsSettingsSchema: Schema = new Schema(
  {
    assignedDeal: { type: Boolean, default: true },
    submittedDealChanges: { type: Boolean, default: true },
    confirmedDeal: { type: Boolean, default: true },
    cancelledDeal: { type: Boolean, default: true },
    completedDeal: { type: Boolean, default: true },
    buyerApprovedMilestone: { type: Boolean, default: true },
    buyerDeniedMilestone: { type: Boolean, default: true },
    supplierUploadedDocument: { type: Boolean, default: true },
    supplierDeletedDocument: { type: Boolean, default: true },
    supplierRequestedMilestoneApproval: { type: Boolean, default: true },
    supplierCancelledMilestoneApproval: { type: Boolean, default: true },
  },
  { _id: false },
);

const UserSchema: Schema = new Schema({
  email: { type: String, unique: true, sparse: true },
  accountType: {
    type: String,
    enum: Object.values(AccountType),
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    sparse: true,
  },
  walletType: {
    type: String,
    enum: Object.values(WalletType),
    default: WalletType.EVM,
    required: true,
  },
  role: {
    type: Number,
    enum: RoleType,
    default: 0,
  },
  kycVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  desktopNotifications: {
    type: NotificationsSettingsSchema,
  },
  emailNotifications: {
    type: NotificationsSettingsSchema,
  },
});

UserSchema.set('toJSON', {
  transform: function (doc: any, ret) {
    ret.id = doc._id.toString();

    delete ret.__v;
  },
});

const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;
