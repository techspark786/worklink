import mongoose, { Schema, Document } from 'mongoose';

export interface ICooperative extends Document {
  name: string;
  registrationNumber: string;
  city: string;
  state: string;
  adminId?: mongoose.Types.ObjectId;
  totalWorkers: number;
  welfareFundBalance: number;
  isVerified: boolean;
  contactEmail: string;
  contactPhone: string;
  createdAt: Date;
}

const CooperativeSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'User' },
    totalWorkers: { type: Number, default: 0 },
    welfareFundBalance: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
    contactEmail: { type: String },
    contactPhone: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICooperative>('Cooperative', CooperativeSchema);
