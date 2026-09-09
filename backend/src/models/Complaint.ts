import mongoose, { Document, Schema } from 'mongoose';

export type ComplaintCategory =
  | 'POOR_SERVICE'
  | 'WORKER_MISCONDUCT'
  | 'LATE_ARRIVAL'
  | 'INCORRECT_BILLING'
  | 'PROPERTY_DAMAGE'
  | 'OTHER';

export type ComplaintSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ComplaintStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';

export interface IComplaint extends Document {
  complaintId: string;
  bookingId: string;
  customerId: mongoose.Types.ObjectId;
  workerId: mongoose.Types.ObjectId;
  cooperativeId: mongoose.Types.ObjectId;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  description: string;
  status: ComplaintStatus;
  arbitrationNotes?: string;
  resolutionAction?: string;
  refundAmount?: number;
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    complaintId: { type: String, required: true, unique: true },
    bookingId: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    cooperativeId: { type: Schema.Types.ObjectId, ref: 'Cooperative', required: true },
    category: {
      type: String,
      enum: ['POOR_SERVICE', 'WORKER_MISCONDUCT', 'LATE_ARRIVAL', 'INCORRECT_BILLING', 'PROPERTY_DAMAGE', 'OTHER'],
      default: 'POOR_SERVICE',
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
      default: 'PENDING',
    },
    arbitrationNotes: { type: String },
    resolutionAction: { type: String },
    refundAmount: { type: Number, default: 0 },
    resolvedAt: { type: Date },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model<IComplaint>('Complaint', ComplaintSchema);
