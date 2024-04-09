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
  name: {
    type: String,
    required: true,
  },
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
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Shipping Properties
  contractId: {
    type: Number,
    required: true,
  },
  nftID: {
    type: Number,
    required: false,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  presentation: {
    type: String,
    required: false,
  },
  size: {
    type: String,
    required: false,
  },
  variety: {
    type: String,
    required: false,
  },
  shippingStartDate: {
    type: Date,
    required: true,
  },
  expectedShippingEndDate: {
    type: Date,
    required: true,
  },
  docs: {
    type: [documentSchema],
  },
  currentMilestone: {
    type: Number,
    required: true,
    default: 0,
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
  // Financial Properties
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
  transform: function (doc: any, ret) {
    ret.id = doc._id.toString();
    ret.status = doc.currentMilestone === 8 ? 'Completed' : 'Ongoing';

    const startDate: Date = doc.shippingStartDate;
    const endDate: Date = doc.expectedShippingEndDate;

    const durationDiff: number = endDate.getTime() - startDate.getTime();
    const daysLeftDiff: number = endDate.getTime() - new Date().getTime();

    const daysInWeek: number = 7;
    const totalDays: number = Math.floor(durationDiff / (1000 * 3600 * 24)); // Converting milliseconds to days
    const totalDaysLeft: number = Math.floor(daysLeftDiff / (1000 * 3600 * 24)); // Converting milliseconds to days

    const duration = Math.ceil(totalDays / daysInWeek);

    ret.duration = duration + ' week' + (duration === 1 ? '' : 's');
    ret.daysLeft = totalDaysLeft;
  },
});

const DealModel = mongoose.model('Deal', dealSchema);

export default DealModel;
