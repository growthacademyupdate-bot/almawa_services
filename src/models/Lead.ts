import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  stage: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  stage: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
