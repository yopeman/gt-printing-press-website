import { dbConnect } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import PortfolioProject from "@/models/PortfolioProject";
import Testimonial from "@/models/Testimonial";
import ClientLogo from "@/models/ClientLogo";
import SiteSetting from "@/models/SiteSetting";
import Service from "@/models/Service";
import Capability from "@/models/Capability";
import Industry from "@/models/Industry";
import AboutContent from "@/models/AboutContent";
import { BLOG_DATA } from "@/data/blog";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { TESTIMONIALS_DATA, CLIENT_LOGOS } from "@/data/testimonials";
import { SERVICES_DATA, ServiceDetail } from "@/data/services";
import { MACHINERY_DATA, MachineSpec } from "@/data/machinery";
import { INDUSTRIES_DATA, IndustryData } from "@/data/industries";
import { ABOUT_DATA, AboutContentData } from "@/data/about";
import { type Locale, type IMediaLink } from "@/types/database";

const CATEGORY_LABELS: Record<string, { en: string; am: string; om: string }> = {
  signage: { en: "Signage & 3D", am: "ሳይኔጅ እና 3D", om: "Mallattoo fi 3D" },
  "large-format-signage": { en: "Signage & 3D", am: "ሳይኔጅ እና 3D", om: "Mallattoo fi 3D" },
  packaging: { en: "Packaging Solutions", am: "ፓኬጂንግ", om: "Paakeejingii" },
  "packaging-solutions": { en: "Packaging Solutions", am: "ፓኬጂንግ", om: "Paakeejingii" },
  publishing: { en: "Publishing & Binding", am: "ህትመት እና ጥረዛ", om: "Maxxansa Barruulee" },
  "publishing-binding": { en: "Publishing & Binding", am: "ህትመት እና ጥረዛ", om: "Maxxansa Barruulee" },
  branding: { en: "Corporate Branding", am: "የድርጅት መለያ", om: "Eenyummeessa Dhaabbataa" },
  "offset-digital-printing": { en: "Offset & Digital Printing", am: "ኦፍሴት እና ዲጂታል ህትመት", om: "Maxxansa Ofseetii fi Dijitaalaa" },
  "graphic-design-prepress": { en: "Graphic Design & Pre-Press", am: "ግራፊክ ዲዛይን እና ቅድመ-ህትመት", om: "Giraafik Dizaayinii fi Qophii" },
  "corporate-promotional-items": { en: "Corporate & Promotional", am: "የድርጅት መለያ እና ማስታወቂያ እቃዎች", om: "Meeshaalee Beeksisa Dhaabbataa" },
};

const BLOG_CATEGORY_LABELS: Record<string, { en: string; am: string; om: string }> = {
  prepress: { en: "Pre-Press & Technical", am: "ቅድመ-ህትመት እና ቴክኒካል", om: "Qophii Maxxansaa" },
  finishing: { en: "Materials & Finishes", am: "የወረቀት እና ማጠናቀቂያ አይነቶች", om: "Waraqaa fi Xumura" },
  technology: { en: "Technology & Industry", am: "ቴክኖሎጂ እና ኢንዱስትሪ", om: "Teeknooloojii fi Maxxansa" },
  "commercial-printing": { en: "Commercial Printing", am: "የንግድ ህትመት", om: "Maxxansa Daldalaa" },
};

function formatProjectFromDb(p: any) {
  const rawCat = p.serviceType || "signage";
  const mappedLabel = CATEGORY_LABELS[rawCat] || {
    en: rawCat.replace(/-/g, " "),
    am: rawCat.replace(/-/g, " "),
    om: rawCat.replace(/-/g, " "),
  };

  const cover =
    p.galleryUrls?.[0] ||
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80";

  return {
    _id: p._id?.toString(),
    slug: p.slug,
    category: rawCat,
    categoryLabel: mappedLabel,
    title: {
      en: p.translations?.en?.title || p.slug,
      am: p.translations?.am?.title || p.translations?.en?.title || p.slug,
      om: p.translations?.om?.title || p.translations?.en?.title || p.slug,
    },
    clientName: p.translations?.en?.clientName || "Corporate Client",
    year: p.year || 2026,
    location: p.translations?.en?.location || "Addis Ababa, Ethiopia",
    summary: {
      en: p.translations?.en?.description || "",
      am: p.translations?.am?.description || p.translations?.en?.description || "",
      om: p.translations?.om?.description || p.translations?.en?.description || "",
    },
    fullDescription: {
      en: p.translations?.en?.description || "",
      am: p.translations?.am?.description || p.translations?.en?.description || "",
      om: p.translations?.om?.description || p.translations?.en?.description || "",
    },
    materialsUsed: p.translations?.en?.materials
      ? p.translations.en.materials
          .split(",")
          .map((m: string) => m.trim())
          .filter(Boolean)
      : ["Industrial Offset", "Custom Finishing"],
    coverImage: cover,
    galleryImages: p.galleryUrls && p.galleryUrls.length > 0 ? p.galleryUrls : [cover],
    featured: Boolean(p.featured),
    tags: p.tags || [],
    mediaLinks: p.mediaLinks || [],
  };
}

function formatBlogPostFromDb(p: any) {
  const rawCat = p.category || "commercial-printing";
  const mappedCat = BLOG_CATEGORY_LABELS[rawCat] || {
    en: rawCat.replace(/-/g, " "),
    am: rawCat.replace(/-/g, " "),
    om: rawCat.replace(/-/g, " "),
  };

  const cover =
    p.coverImage ||
    p.galleryUrls?.[0] ||
    "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80";

  const englishBody = p.translations?.en?.body || "";
  const wordCount = englishBody.split(/\s+/).filter(Boolean).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 180))} min read`;

  const pubDate = p.publishedAt
    ? new Date(p.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently Published";

  return {
    _id: p._id?.toString(),
    slug: p.slug,
    category: rawCat,
    categoryLabel: mappedCat,
    title: {
      en: p.translations?.en?.title || p.slug,
      am: p.translations?.am?.title || p.translations?.en?.title || p.slug,
      om: p.translations?.om?.title || p.translations?.en?.title || p.slug,
    },
    excerpt: {
      en: p.translations?.en?.excerpt || "",
      am: p.translations?.am?.excerpt || p.translations?.en?.excerpt || "",
      om: p.translations?.om?.excerpt || p.translations?.en?.excerpt || "",
    },
    content: {
      en: p.translations?.en?.body || "",
      am: p.translations?.am?.body || p.translations?.en?.body || "",
      om: p.translations?.om?.body || p.translations?.en?.body || "",
    },
    author: "GT Technical Pre-Press Team",
    authorRole: "Senior Color Separation & Offset Specialists",
    publishedDate: pubDate,
    readTime,
    coverImage: cover,
    galleryImages: p.galleryUrls || [],
    tags: p.tags || [],
    mediaLinks: p.mediaLinks || [],
  };
}

/**
 * Fetch all published blog posts from MongoDB with fallback to static data
 */
export async function getDbBlogPosts() {
  try {
    await dbConnect();
    const dbPosts = await BlogPost.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    if (dbPosts && dbPosts.length > 0) {
      return dbPosts.map(formatBlogPostFromDb);
    }
  } catch (error) {
    console.error("[getDbBlogPosts Error]", error);
  }

  return BLOG_DATA;
}

/**
 * Fetch a single blog post by slug from MongoDB with fallback to static data
 */
export async function getDbBlogPostBySlug(slug: string) {
  try {
    await dbConnect();
    const dbPost = await BlogPost.findOne({ slug, status: "published" }).lean();
    if (dbPost) {
      return formatBlogPostFromDb(dbPost);
    }
  } catch (error) {
    console.error("[getDbBlogPostBySlug Error]", error);
  }

  return BLOG_DATA.find((p) => p.slug === slug) || null;
}

/**
 * Fetch related blog posts from MongoDB
 */
export async function getDbRelatedBlogPosts(currentSlug: string, limit = 2) {
  try {
    await dbConnect();
    const dbRelated = await BlogPost.find({ slug: { $ne: currentSlug }, status: "published" })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    if (dbRelated && dbRelated.length > 0) {
      return dbRelated.map(formatBlogPostFromDb);
    }
  } catch (error) {
    console.error("[getDbRelatedBlogPosts Error]", error);
  }

  return BLOG_DATA.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

/**
 * Fetch all portfolio projects from MongoDB with fallback to static data
 */
export async function getDbPortfolioProjects() {
  try {
    await dbConnect();
    const dbProjects = await PortfolioProject.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map(formatProjectFromDb);
    }
  } catch (error) {
    console.error("[getDbPortfolioProjects Error]", error);
  }

  return PORTFOLIO_DATA;
}

/**
 * Fetch a single portfolio project by slug from MongoDB with fallback to static data
 */
export async function getDbPortfolioProjectBySlug(slug: string) {
  try {
    await dbConnect();
    const dbProj = await PortfolioProject.findOne({ slug }).lean();
    if (dbProj) {
      return formatProjectFromDb(dbProj);
    }
  } catch (error) {
    console.error("[getDbPortfolioProjectBySlug Error]", error);
  }

  return PORTFOLIO_DATA.find((p) => p.slug === slug) || null;
}

/**
 * Fetch related portfolio projects for a service category
 */
export async function getDbRelatedProjectsForService(serviceSlug: string, limit = 2) {
  try {
    await dbConnect();
    const keyword = serviceSlug.split("-")[0];
    const dbProjects = await PortfolioProject.find({
      $or: [
        { serviceType: serviceSlug },
        { serviceType: { $regex: keyword, $options: "i" } },
      ],
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map(formatProjectFromDb);
    }
  } catch (error) {
    console.error("[getDbRelatedProjectsForService Error]", error);
  }

  return PORTFOLIO_DATA.filter((p) => {
    if (serviceSlug.includes("signage")) return p.category === "signage";
    if (serviceSlug.includes("packaging")) return p.category === "packaging";
    if (serviceSlug.includes("publishing")) return p.category === "publishing";
    return p.category === "branding";
  }).slice(0, limit);
}

/**
 * Fetch all published testimonials from MongoDB
 */
export async function getDbTestimonials() {
  try {
    await dbConnect();
    const docs = await Testimonial.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (docs && docs.length > 0) {
      return docs.map((t: any) => ({
        id: t._id?.toString(),
        name: t.clientName,
        role: t.role,
        company: t.company,
        rating: 5,
        avatarUrl: t.avatarUrl || "",
        quote: {
          en: t.translations?.en?.quote || "",
          am: t.translations?.am?.quote || t.translations?.en?.quote || "",
          om: t.translations?.om?.quote || t.translations?.en?.quote || "",
        },
      }));
    }
  } catch (error) {
    console.error("[getDbTestimonials Error]", error);
  }

  return TESTIMONIALS_DATA;
}

/**
 * Fetch all client logos from MongoDB
 */
export async function getDbClientLogos() {
  try {
    await dbConnect();
    const clients = await ClientLogo.find().sort({ order: 1, createdAt: 1 }).lean();
    if (clients && clients.length > 0) {
      return clients.map((c: any) => ({
        id: c._id?.toString(),
        name: c.name,
        logoUrl: c.logoUrl,
        category: c.category || "general",
        order: c.order || 0,
      }));
    }
  } catch (error) {
    console.error("[getDbClientLogos Error]", error);
  }

  return CLIENT_LOGOS.map((c, idx) => ({
    id: `static-${idx}`,
    name: c.name,
    logoUrl: "",
    category: c.label,
    order: idx,
  }));
}

function formatServiceFromDb(s: any): ServiceDetail & { _id?: string; mediaLinks?: IMediaLink[] } {
  return {
    _id: s._id?.toString(),
    slug: s.slug,
    glyph: s.glyph || "offset-roller",
    title: {
      en: s.translations?.en?.title || s.slug,
      am: s.translations?.am?.title || s.translations?.en?.title || s.slug,
      om: s.translations?.om?.title || s.translations?.en?.title || s.slug,
    },
    shortDesc: {
      en: s.translations?.en?.shortDesc || "",
      am: s.translations?.am?.shortDesc || s.translations?.en?.shortDesc || "",
      om: s.translations?.om?.shortDesc || s.translations?.en?.shortDesc || "",
    },
    fullDesc: {
      en: s.translations?.en?.fullDesc || "",
      am: s.translations?.am?.fullDesc || s.translations?.en?.fullDesc || "",
      om: s.translations?.om?.fullDesc || s.translations?.en?.fullDesc || "",
    },
    typicalProducts: {
      en: s.translations?.en?.typicalProducts || [],
      am: s.translations?.am?.typicalProducts || s.translations?.en?.typicalProducts || [],
      om: s.translations?.om?.typicalProducts || s.translations?.en?.typicalProducts || [],
    },
    finishesAndMaterials: {
      en: s.translations?.en?.finishesAndMaterials || [],
      am: s.translations?.am?.finishesAndMaterials || s.translations?.en?.finishesAndMaterials || [],
      om: s.translations?.om?.finishesAndMaterials || s.translations?.en?.finishesAndMaterials || [],
    },
    equipmentUsed: s.equipmentUsed || [],
    turnaroundTime: {
      en: s.translations?.en?.turnaroundTime || "",
      am: s.translations?.am?.turnaroundTime || s.translations?.en?.turnaroundTime || "",
      om: s.translations?.om?.turnaroundTime || s.translations?.en?.turnaroundTime || "",
    },
    coverImage:
      s.coverImage ||
      "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80",
    galleryImages:
      s.galleryUrls && s.galleryUrls.length > 0 ? s.galleryUrls : [s.coverImage],
    mediaLinks: s.mediaLinks || [],
  };
}

/**
 * Fetch all active services from MongoDB with fallback to static SERVICES_DATA
 */
export async function getDbServices(): Promise<(ServiceDetail & { _id?: string; mediaLinks?: IMediaLink[] })[]> {
  try {
    await dbConnect();
    const docs = await Service.find({ active: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    if (docs && docs.length > 0) {
      return docs.map(formatServiceFromDb);
    }
  } catch (error) {
    console.error("[getDbServices Error]", error);
  }

  return SERVICES_DATA;
}

/**
 * Fetch a single service by slug from MongoDB with fallback
 */
export async function getDbServiceBySlug(slug: string): Promise<(ServiceDetail & { _id?: string; mediaLinks?: IMediaLink[] }) | null> {
  try {
    await dbConnect();
    const doc = await Service.findOne({ slug, active: { $ne: false } }).lean();
    if (doc) {
      return formatServiceFromDb(doc);
    }
  } catch (error) {
    console.error("[getDbServiceBySlug Error]", error);
  }

  return SERVICES_DATA.find((s) => s.slug === slug) || null;
}

function formatMachineFromDb(m: any): MachineSpec & { _id?: string; mediaLinks?: IMediaLink[] } {
  return {
    _id: m._id?.toString(),
    name: m.name,
    category: m.category || "offset",
    manufacturer: m.manufacturer,
    origin: m.origin,
    keySpecs: m.keySpecs || [],
    description: {
      en: m.translations?.en?.description || "",
      am: m.translations?.am?.description || m.translations?.en?.description || "",
      om: m.translations?.om?.description || m.translations?.en?.description || "",
    },
    image: m.image,
    mediaLinks: m.mediaLinks || [],
  };
}

/**
 * Fetch all active plant machinery from MongoDB with fallback to static MACHINERY_DATA
 */
export async function getDbMachinery(): Promise<(MachineSpec & { _id?: string; mediaLinks?: IMediaLink[] })[]> {
  try {
    await dbConnect();
    const docs = await Capability.find({ active: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    if (docs && docs.length > 0) {
      return docs.map(formatMachineFromDb);
    }
  } catch (error) {
    console.error("[getDbMachinery Error]", error);
  }

  return MACHINERY_DATA;
}

function formatIndustryFromDb(ind: any): IndustryData & { _id?: string; mediaLinks?: IMediaLink[] } {
  return {
    _id: ind._id?.toString(),
    slug: ind.slug,
    icon: ind.icon || "Building",
    image: ind.image || "",
    galleryUrls: ind.galleryUrls || [],
    mediaLinks: ind.mediaLinks || [],
    order: ind.order || 0,
    active: ind.active !== false,
    translations: {
      en: {
        title: ind.translations?.en?.title || "",
        subtitle: ind.translations?.en?.subtitle || "",
        description: ind.translations?.en?.description || "",
        products: ind.translations?.en?.products || [],
      },
      am: {
        title: ind.translations?.am?.title || ind.translations?.en?.title || "",
        subtitle: ind.translations?.am?.subtitle || ind.translations?.en?.subtitle || "",
        description: ind.translations?.am?.description || ind.translations?.en?.description || "",
        products: ind.translations?.am?.products || ind.translations?.en?.products || [],
      },
      om: {
        title: ind.translations?.om?.title || ind.translations?.en?.title || "",
        subtitle: ind.translations?.om?.subtitle || ind.translations?.en?.subtitle || "",
        description: ind.translations?.om?.description || ind.translations?.en?.description || "",
        products: ind.translations?.om?.products || ind.translations?.en?.products || [],
      },
    },
  };
}

/**
 * Fetch all active industries from MongoDB with fallback to static INDUSTRIES_DATA
 */
export async function getDbIndustries(): Promise<(IndustryData & { _id?: string; mediaLinks?: IMediaLink[] })[]> {
  try {
    await dbConnect();
    const docs = await Industry.find({ active: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    if (docs && docs.length > 0) {
      return docs.map(formatIndustryFromDb);
    }
  } catch (error) {
    console.error("[getDbIndustries Error]", error);
  }

  return INDUSTRIES_DATA;
}

/**
 * Fetch about content from MongoDB with fallback to static ABOUT_DATA
 */
export async function getDbAboutContent(): Promise<AboutContentData & { _id?: string }> {
  try {
    await dbConnect();
    const doc = await AboutContent.findOne().lean();
    if (doc) {
      return {
        _id: doc._id?.toString(),
        heroBadge: doc.heroBadge || ABOUT_DATA.heroBadge,
        heroTitle: doc.heroTitle || ABOUT_DATA.heroTitle,
        heroSubtitle: doc.heroSubtitle || ABOUT_DATA.heroSubtitle,
        storyTag: doc.storyTag || ABOUT_DATA.storyTag,
        storyTitle: doc.storyTitle || ABOUT_DATA.storyTitle,
        storyParagraphs: doc.storyParagraphs || ABOUT_DATA.storyParagraphs,
        storyImage: doc.storyImage || ABOUT_DATA.storyImage,
        galleryUrls: doc.galleryUrls || ABOUT_DATA.galleryUrls,
        mediaLinks: doc.mediaLinks || ABOUT_DATA.mediaLinks || [],
        missionTitle: doc.missionTitle || ABOUT_DATA.missionTitle,
        missionText: doc.missionText || ABOUT_DATA.missionText,
        visionTitle: doc.visionTitle || ABOUT_DATA.visionTitle,
        visionText: doc.visionText || ABOUT_DATA.visionText,
        achievements: (doc.achievements && doc.achievements.length > 0) ? doc.achievements : ABOUT_DATA.achievements,
        ctaTitle: doc.ctaTitle || ABOUT_DATA.ctaTitle,
        ctaSubtitle: doc.ctaSubtitle || ABOUT_DATA.ctaSubtitle,
      };
    }
  } catch (error) {
    console.error("[getDbAboutContent Error]", error);
  }

  return ABOUT_DATA;
}

