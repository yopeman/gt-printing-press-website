import { dbConnect } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import PortfolioProject from "@/models/PortfolioProject";
import Testimonial from "@/models/Testimonial";
import ClientLogo from "@/models/ClientLogo";
import SiteSetting from "@/models/SiteSetting";
import { BLOG_DATA } from "@/data/blog";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { TESTIMONIALS_DATA, CLIENT_LOGOS } from "@/data/testimonials";
import { type Locale } from "@/types/database";

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
