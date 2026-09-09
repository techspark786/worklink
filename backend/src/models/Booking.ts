import mongoose, { Schema, Document } from 'mongoose';

export type BookingUrgency = 'EMERGENCY_45_MIN' | 'SAME_DAY' | 'SCHEDULED';
export type BookingStatus = 
  | 'REQUESTED' 
  | 'ACCEPTED' 
  | 'ASSIGNED' 
  | 'ARRIVED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  workerId: mongoose.Types.ObjectId;
  cooperativeId?: mongoose.Types.ObjectId;
  serviceTitle: string;
  serviceCategory: string;
  description: string;
  urgency: BookingUrgency;
  scheduledDate: string;
  timeSlot: string;
  customerLocation: {
    address: string;
    landmark?: string;
    city: string;
    pincode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  pricing: {
    baseWage: number;
    welfareCess: number;
    platformFee: number;
    totalAmount: number;
    savingsVsAggregator: number;
  };
  status: BookingStatus;
  startOtp: string;
  completionOtp: string;
  matchScore: number;
  customerNotes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    cooperativeId: { type: Schema.Types.ObjectId, ref: 'Cooperative' },
    serviceTitle: { type: String, required: true },
    serviceCategory: { type: String, required: true },
    description: { type: String, required: true },
    urgency: {
      type: String,
      enum: ['EMERGENCY_45_MIN', 'SAME_DAY', 'SCHEDULED'],
      default: 'SAME_DAY',
    },
    scheduledDate: { type: String, required: true },
    timeSlot: { type: String, default: '10:00 AM - 12:00 PM' },
    customerLocation: {
      address: { type: String, required: true },
      landmark: { type: String, default: '' },
      city: { type: String, default: 'Lucknow' },
      pincode: { type: String, default: '226001' },
      coordinates: {
        latitude: { type: Number, default: 26.8467 },
        longitude: { type: Number, default: 80.9462 },
      },
    },
    pricing: {
      baseWage: { type: Number, required: true },
      welfareCess: { type: Number, required: true },
      platformFee: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
      savingsVsAggregator: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['REQUESTED', 'ACCEPTED', 'ASSIGNED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'REQUESTED',
    },
    startOtp: { type: String, default: '1234' },
    completionOtp: { type: String, default: '5678' },
    matchScore: { type: Number, default: 95 },
    customerNotes: { type: String, default: '' },
    cancellationReason: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
