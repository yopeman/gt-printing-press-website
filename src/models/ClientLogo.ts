import mongoose, { Schema, Model } from "mongoose";
import { IClientLogo } from "@/types/database";

const ClientLogoSchema = new Schema<IClientLogo>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    logoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "general",
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ClientLogo: Model<IClientLogo> =
  mongoose.models.ClientLogo ||
  mongoose.model<IClientLogo>("ClientLogo", ClientLogoSchema);

export default ClientLogo;
