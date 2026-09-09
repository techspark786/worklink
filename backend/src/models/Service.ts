import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  category: string;
  description: string;
  iconName: string;
  basePrice: number;
  emergencySupported: boolean;
  requiredSkills: string[];
  isActive: boolean;
}

const ServiceSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, default: 'Wrench' },
    basePrice: { type: Number, required: true },
    emergencySupported: { type: Boolean, default: true },
    requiredSkills: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IService>('Service', ServiceSchema);
