import mongoose, { Schema, Model } from "mongoose";
import { IPortfolioProject } from "@/types/database";

const TranslationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    materials: { type: String, trim: true },
    clientName: { type: String, trim: true },
    location: { type: String, trim: true },
  },
  { _id: false }
);

const PortfolioProjectSchema = new Schema<IPortfolioProject>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    serviceType: {
      type: String,
      required: true,
      index: true,
    },
    industry: {
      type: String,
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      default: 2026,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    galleryUrls: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    mediaLinks: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        title: { type: String, default: "" },
      },
    ],
    translations: {
      en: { type: TranslationSchema, required: true },
      am: { type: TranslationSchema, required: false },
      om: { type: TranslationSchema, required: false },
    },
  },
  {
    timestamps: true,
  }
);

export const PortfolioProject: Model<IPortfolioProject> =
  mongoose.models.PortfolioProject ||
  mongoose.model<IPortfolioProject>("PortfolioProject", PortfolioProjectSchema);

export default PortfolioProject;
