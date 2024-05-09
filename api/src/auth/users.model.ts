import mongoose, { Schema } from 'mongoose';

export enum AccountType {
  Supplier = 'supplier',
  Buyer = 'buyer',
  Investor = 'investor',
}

export enum RoleType {
  REGULAR = 0,
  ADMIN = 1,
}

export interface User {
  email: string;
  accountType: string;
  walletAddress: string;
  walletType: string;
  role: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String },
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
  walletType: { type: String, required: true },
  role: {
    type: Number,
    enum: RoleType,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;
