import mongoose, { Schema, Model } from "mongoose";
import { ICapability } from "@/types/database";

const CapabilityTranslationSchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CapabilitySchema = new Schema<ICapability>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["offset", "cutting", "binding", "finishing", "signage", "other"],
      default: "offset",
      index: true,
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    origin: {
      type: String,
      required: true,
      trim: true,
    },
    keySpecs: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: true,
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
      en: { type: CapabilityTranslationSchema, required: true },
      am: { type: CapabilityTranslationSchema, required: false },
      om: { type: CapabilityTranslationSchema, required: false },
    },
  },
  {
    timestamps: true,
  }
);

export const Capability: Model<ICapability> =
  mongoose.models.Capability ||
  mongoose.model<ICapability>("Capability", CapabilitySchema);

export default Capability;
