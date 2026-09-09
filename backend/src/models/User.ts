import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'CUSTOMER' | 'WORKER' | 'COOPERATIVE_ADMIN' | 'FEDERATION_ADMIN';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
  };
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ['CUSTOMER', 'WORKER', 'COOPERATIVE_ADMIN', 'FEDERATION_ADMIN'],
      default: 'CUSTOMER',
    },
    avatar: { type: String },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
      city: { type: String },
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
