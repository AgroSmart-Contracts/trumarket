import mongoose, { Schema } from 'mongoose';

export enum RoleType {
  REGULAR = 0,
  ADMIN = 1,
}

const userSchema = new Schema({
  address: {
    type: String,
    required: true,
    lowercase: true,
  },
  role: {
    type: Number,
    enum: RoleType,
    default: 0,
  },
});

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = doc._id.toString();
  },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
