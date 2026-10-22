import mongoose, { Schema, Model } from "mongoose";
import { IContactMessage } from "@/types/database";

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    locale: {
      type: String,
      enum: ["en", "am", "om"],
      default: "en",
    },
    status: {
      type: String,
      enum: ["New", "Read", "Replied", "Archived"],
      default: "New",
      index: true,
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

export const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);

export default ContactMessage;
