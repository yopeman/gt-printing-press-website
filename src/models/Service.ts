import mongoose, { Schema, Model } from "mongoose";
import { IService } from "@/types/database";

const ServiceTranslationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDesc: { type: String, required: true, trim: true },
    fullDesc: { type: String, required: true, trim: true },
    typicalProducts: { type: [String], default: [] },
    finishesAndMaterials: { type: [String], default: [] },
    turnaroundTime: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ServiceSchema = new Schema<IService>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    glyph: {
      type: String,
      required: true,
      default: "offset-roller",
    },
    coverImage: {
      type: String,
      required: true,
    },
    galleryUrls: {
      type: [String],
      default: [],
    },
    equipmentUsed: {
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
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    translations: {
      en: { type: ServiceTranslationSchema, required: true },
      am: { type: ServiceTranslationSchema, required: false },
      om: { type: ServiceTranslationSchema, required: false },
    },
  },
  {
    timestamps: true,
  }
);

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
