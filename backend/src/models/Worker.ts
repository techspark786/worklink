import mongoose, { Schema, Document } from 'mongoose';

export interface IWorker extends Document {
  userId: mongoose.Types.ObjectId;
  cooperativeId?: mongoose.Types.ObjectId;
  profession: string;
  about?: string;
  skills: string[];
  experienceYears: number;
  certifications: {
    title: string;
    issuer: string;
    verified: boolean;
  }[];
  verificationLevel: number; // 0 to 5
  isAvailable: boolean;
  serviceRadiusKm: number;
  hourlyRate: number;
  rating: number;
  totalCompletedJobs: number;
  welfareContributionTotal: number;
  insuranceActive: boolean;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    address?: string;
  };
}

const WorkerSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cooperativeId: { type: Schema.Types.ObjectId, ref: 'Cooperative' },
    profession: { type: String, default: 'General Maintenance' },
    about: { type: String, default: '' },
    skills: [{ type: String }],
    experienceYears: { type: Number, default: 1 },
    certifications: [
      {
        title: String,
        issuer: String,
        verified: { type: Boolean, default: false },
      },
    ],
    verificationLevel: { type: Number, default: 1, min: 0, max: 5 },
    isAvailable: { type: Boolean, default: true },
    serviceRadiusKm: { type: Number, default: 5 },
    hourlyRate: { type: Number, default: 350 },
    rating: { type: Number, default: 4.8 },
    totalCompletedJobs: { type: Number, default: 0 },
    welfareContributionTotal: { type: Number, default: 0 },
    insuranceActive: { type: Boolean, default: true },
    location: {
      latitude: { type: Number, default: 26.8467 },
      longitude: { type: Number, default: 80.9462 },
      city: { type: String, default: 'Lucknow' },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IWorker>('Worker', WorkerSchema);
