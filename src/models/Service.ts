import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  content: string;
  icon: string;
  image?: string;
  category: string;
  status: "Active" | "Inactive";
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true, maxlength: 250 },
    content: { type: String, required: true },
    icon: { type: String, default: "Briefcase" },
    image: { type: String },
    category: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    displayOrder: { type: Number, default: 1 },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
