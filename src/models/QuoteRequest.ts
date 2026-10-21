import mongoose, { Schema, Model } from "mongoose";
import { IQuoteRequest } from "@/types/database";

const AttachmentSchema = new Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false }
);

const QuoteRequestSchema = new Schema<IQuoteRequest>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: [
        "offset-digital-printing",
        "publishing-binding",
        "packaging-solutions",
        "large-format-signage",
        "graphic-design-prepress",
        "corporate-promotional-items",
        "other",
      ],
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    preferredContact: {
      type: String,
      enum: ["phone", "telegram", "email"],
      default: "phone",
    },
    specification: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: String,
      default: "",
    },
    neededBy: {
      type: String,
      default: "",
    },
    artworkStatus: {
      type: String,
      enum: ["ready", "need_help"],
      default: "ready",
    },
    locale: {
      type: String,
      enum: ["en", "am", "om"],
      default: "en",
    },
    attachments: [AttachmentSchema],
    status: {
      type: String,
      enum: ["New", "Contacted", "Quoted", "Won", "Lost"],
      default: "New",
      index: true,
    },
    notes: {
      type: String,
      default: "",
    },
    telegramDeliveryStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const QuoteRequest: Model<IQuoteRequest> =
  mongoose.models.QuoteRequest ||
  mongoose.model<IQuoteRequest>("QuoteRequest", QuoteRequestSchema);

export default QuoteRequest;
