import mongoose, { Schema, Model } from "mongoose";
import { IAboutContent } from "@/types/database";

const LocaleStringSchema = new Schema(
  {
    en: { type: String, default: "" },
    am: { type: String, default: "" },
    om: { type: String, default: "" },
  },
  { _id: false }
);

const LocaleStringArraySchema = new Schema(
  {
    en: { type: [String], default: [] },
    am: { type: [String], default: [] },
    om: { type: [String], default: [] },
  },
  { _id: false }
);

const AchievementSchema = new Schema(
  {
    title: { type: LocaleStringSchema, required: true },
    desc: { type: LocaleStringSchema, required: true },
  },
  { _id: false }
);

const AboutContentSchema = new Schema<IAboutContent>(
  {
    heroBadge: { type: LocaleStringSchema, required: true },
    heroTitle: { type: LocaleStringSchema, required: true },
    heroSubtitle: { type: LocaleStringSchema, required: true },
    storyTag: { type: LocaleStringSchema, required: true },
    storyTitle: { type: LocaleStringSchema, required: true },
    storyParagraphs: { type: LocaleStringArraySchema, required: true },
    storyImage: { type: String, default: "/gt-logo.png" },
    galleryUrls: { type: [String], default: [] },
    mediaLinks: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        title: { type: String, default: "" },
      },
    ],
    missionTitle: { type: LocaleStringSchema, required: true },
    missionText: { type: LocaleStringSchema, required: true },
    visionTitle: { type: LocaleStringSchema, required: true },
    visionText: { type: LocaleStringSchema, required: true },
    achievements: { type: [AchievementSchema], default: [] },
    ctaTitle: { type: LocaleStringSchema, required: true },
    ctaSubtitle: { type: LocaleStringSchema, required: true },
  },
  {
    timestamps: true,
  }
);

export const AboutContent: Model<IAboutContent> =
  mongoose.models.AboutContent ||
  mongoose.model<IAboutContent>("AboutContent", AboutContentSchema);

export default AboutContent;
