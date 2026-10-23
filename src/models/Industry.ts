import mongoose, { Schema, Model } from "mongoose";
import { IIndustry } from "@/types/database";

const IndustryTranslationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    products: { type: [String], default: [] },
  },
  { _id: false }
);

const IndustrySchema = new Schema<IIndustry>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    icon: {
      type: String,
      required: true,
      default: "Building",
    },
    image: {
      type: String,
      default: "",
    },
    galleryUrls: {
      type: [String],
      default: [],
    },
    mediaLinks: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        title: { type: String, default: "" },
      },
    ],
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    translations: {
      en: { type: IndustryTranslationSchema, required: true },
      am: { type: IndustryTranslationSchema, required: false },
      om: { type: IndustryTranslationSchema, required: false },
    },
  },
  {
    timestamps: true,
  }
);

export const Industry: Model<IIndustry> =
  mongoose.models.Industry ||
  mongoose.model<IIndustry>("Industry", IndustrySchema);

export default Industry;
