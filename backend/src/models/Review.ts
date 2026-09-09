import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  reviewId: string;
  bookingId: string;
  workerId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  overallRating: number; // 1-5
  skillRating: number; // 1-5
  behaviourRating: number; // 1-5
  punctualityRating: number; // 1-5
  serviceQualityRating: number; // 1-5
  comment: string;
  isVerifiedBooking: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    reviewId: { type: String, required: true, unique: true },
    bookingId: { type: String, required: true },
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    overallRating: { type: Number, required: true, min: 1, max: 5 },
    skillRating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    behaviourRating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    punctualityRating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    serviceQualityRating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, required: true },
    isVerifiedBooking: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
