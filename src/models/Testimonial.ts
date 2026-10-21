import mongoose, { Schema, Model } from "mongoose";
import { ITestimonial } from "@/types/database";

const TranslationSchema = new Schema(
  {
    quote: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
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

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
