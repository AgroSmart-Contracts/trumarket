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

export interface User {
  id: string;
  email: string;
  accountType: string;
  walletAddress: string;
  walletType: string;
  role: number;
  createdAt: Date;
  kycVerified: boolean;
}

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
});

UserSchema.set('toJSON', {
  transform: function (doc: any, ret) {
    ret.id = doc._id.toString();

    delete ret.__v;
  },
});

const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;
