export type Locale = "en" | "am" | "om";

export type ServiceType =
  | "offset-digital-printing"
  | "publishing-binding"
  | "packaging-solutions"
  | "large-format-signage"
  | "graphic-design-prepress"
  | "corporate-promotional-items"
  | "other"
  | (string & {});

export type ContactMethod = "phone" | "telegram" | "email";

export type ArtworkStatus = "ready" | "need_help";

export type QuoteStatus = "New" | "Contacted" | "Quoted" | "Won" | "Lost";

export type TelegramDeliveryStatus = "pending" | "sent" | "failed";

export type UserRole = "admin" | "editor";

export interface IAttachment {
  fileName: string;
  fileUrl: string;
  size: number;
}

export interface IQuoteRequest {
  _id?: string;
  reference: string;
  serviceType: ServiceType;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  preferredContact: ContactMethod;
  specification: string;
  quantity?: string;
  neededBy?: string;
  artworkStatus: ArtworkStatus;
  locale: Locale;
  attachments?: IAttachment[];
  externalFileUrl?: string;
  status: QuoteStatus;
  notes?: string;
  telegramDeliveryStatus: TelegramDeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactMessageStatus = "New" | "Read" | "Replied" | "Archived";

export interface IContactMessage {
  _id?: string;
  reference: string;
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message: string;
  locale: Locale;
  status: ContactMessageStatus;
  notes?: string;
  telegramDeliveryStatus: TelegramDeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type MediaLinkType =
  | "youtube"
  | "youtube_short"
  | "vimeo"
  | "image"
  | "social"
  | "website"
  | "other";

export interface IMediaLink {
  type: MediaLinkType;
  url: string;
  title?: string;
}

export interface IBlogPostTranslation {
  title: string;
  excerpt: string;
  body: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface IBlogPost {
  _id?: string;
  slug: string;
  coverImage: string;
  galleryUrls?: string[];
  category: string;
  status: "draft" | "scheduled" | "published";
  tags?: string[];
  mediaLinks?: IMediaLink[];
  publishedAt?: Date;
  translations: Record<Locale, IBlogPostTranslation>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPortfolioTranslation {
  title: string;
  description: string;
  materials?: string;
  clientName?: string;
  location?: string;
}

export interface IPortfolioProject {
  _id?: string;
  slug: string;
  serviceType: ServiceType | string;
  industry: string;
  year: number;
  featured: boolean;
  order: number;
  galleryUrls: string[];
  tags?: string[];
  mediaLinks?: IMediaLink[];
  translations: Record<Locale, IPortfolioTranslation>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestimonialTranslation {
  quote: string;
}

export interface ITestimonial {
  _id?: string;
  clientName: string;
  role: string;
  company: string;
  avatarUrl?: string;
  order: number;
  published: boolean;
  translations: Record<Locale, ITestimonialTranslation>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClientLogo {
  _id?: string;
  name: string;
  logoUrl: string;
  category?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISiteSetting {
  _id?: string;
  key: string;
  value: any;
  description?: string;
  updatedAt: Date;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  active?: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceTranslation {
  title: string;
  shortDesc: string;
  fullDesc: string;
  typicalProducts: string[];
  finishesAndMaterials: string[];
  turnaroundTime: string;
}

export interface IService {
  _id?: string;
  slug: string;
  glyph:
    | "offset-roller"
    | "uv-flatbed"
    | "laser-beam"
    | "cnc-router"
    | "guillotine-blade"
    | "foil-emboss"
    | "thermal-laminate"
    | "saddle-stitch";
  coverImage: string;
  galleryUrls: string[];
  equipmentUsed: string[];
  mediaLinks?: IMediaLink[];
  order: number;
  featured: boolean;
  active: boolean;
  translations: Record<Locale, IServiceTranslation>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICapabilityTranslation {
  description: string;
}

export interface ICapability {
  _id?: string;
  name: string;
  slug?: string;
  category: "offset" | "cutting" | "binding" | "finishing" | "signage" | "other";
  manufacturer: string;
  origin: string;
  keySpecs: string[];
  image: string;
  galleryUrls?: string[];
  mediaLinks?: IMediaLink[];
  order: number;
  active: boolean;
  translations: Record<Locale, ICapabilityTranslation>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IIndustryTranslation {
  title: string;
  subtitle: string;
  description: string;
  products: string[];
}

export interface IIndustry {
  _id?: string;
  slug: string;
  icon: string;
  image?: string;
  galleryUrls?: string[];
  mediaLinks?: IMediaLink[];
  order: number;
  active: boolean;
  translations: Record<Locale, IIndustryTranslation>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAboutAchievement {
  title: Record<Locale, string>;
  desc: Record<Locale, string>;
}

export interface IAboutContent {
  _id?: string;
  heroBadge: Record<Locale, string>;
  heroTitle: Record<Locale, string>;
  heroSubtitle: Record<Locale, string>;
  storyTag: Record<Locale, string>;
  storyTitle: Record<Locale, string>;
  storyParagraphs: Record<Locale, string[]>;
  storyImage: string;
  galleryUrls?: string[];
  mediaLinks?: IMediaLink[];
  missionTitle: Record<Locale, string>;
  missionText: Record<Locale, string>;
  visionTitle: Record<Locale, string>;
  visionText: Record<Locale, string>;
  achievements: IAboutAchievement[];
  ctaTitle: Record<Locale, string>;
  ctaSubtitle: Record<Locale, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

