import mongoose, { Schema, Model } from "mongoose";
import { IBlogPost } from "@/types/database";

const TranslationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
  },
  { _id: false }
);

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    coverImage: {
      type: String,
      required: true,
      trim: true,
    },
    galleryUrls: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
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
    status: {
      type: String,
      enum: ["draft", "scheduled", "published"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
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

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
