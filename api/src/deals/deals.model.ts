import mongoose, { Schema } from 'mongoose';

const documentSchema = new Schema({
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
});

documentSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = doc._id.toString();
  },
});

const walletSchema = new Schema({
  address: {
    type: String,
    lowercase: true,
    required: true,
  },
});

walletSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = doc._id.toString();
  },
});

// Define the Milestone schema
const milestoneSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  docs: {
    type: [documentSchema],
  },
});

milestoneSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = doc._id.toString();
  },
});

// Define the Deal schema
const dealSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  deliveryStartDate: {
    type: Date,
    required: true,
  },
  deliveryEndDate: {
    type: Date,
    required: true,
  },
  docs: {
    type: [documentSchema],
  },
  milestones: {
    type: [milestoneSchema],
    validate: [
      {
        validator: (value) => value.length === 7,
        message: 'Milestones array must have exactly 7 elements',
      },
    ],
    required: true,
  },
  investmentAmount: {
    type: Number,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },
  netBalance: {
    type: Number,
    required: true,
  },
  roi: {
    type: Number,
    required: true,
  },
  carbonFootprint: {
    type: String,
    required: true,
  },
  whitelist: {
    type: [walletSchema],
    default: [],
  },
});

dealSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = doc._id.toString();
  },
});

const DealModel = mongoose.model('Deal', dealSchema);

export default DealModel;
