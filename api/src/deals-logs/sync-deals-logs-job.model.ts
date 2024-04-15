import * as mongoose from 'mongoose';

// Define the interface for SyncDealsLogsJob document
interface ISyncDealsLogsJob extends mongoose.Document {
  chainProvider: string;
  type: string;
  contract: string;
  lastBlock: number;
  lastExecution: Date;
  lastStatus: string;
}

// Define the Mongoose Schema for SyncDealsLogsJob
const SyncDealsLogsJobSchema = new mongoose.Schema({
  chainProvider: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  contract: {
    type: String,
    required: true,
  },
  lastBlock: {
    type: Number,
    default: 0,
  },
  lastExecution: {
    type: Date,
  },
  lastStatus: {
    type: String,
  },
  error: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Mongoose model for SyncDealsLogsJob
const SyncDealsLogsJob = mongoose.model<ISyncDealsLogsJob>(
  'SyncDealsLogsJob',
  SyncDealsLogsJobSchema,
);

export default SyncDealsLogsJob;
