import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import PortfolioProject from "@/models/PortfolioProject";
import SiteSetting from "@/models/SiteSetting";
import BlogPost from "@/models/BlogPost";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    // 1. Check if custom hero images are configured in SiteSetting
    const settingsDoc = await SiteSetting.findOne({ key: "general_config" }).lean();
    if (
      settingsDoc?.value?.heroImages &&
      Array.isArray(settingsDoc.value.heroImages) &&
      settingsDoc.value.heroImages.length > 0
    ) {
      const items = settingsDoc.value.heroImages.map((img: any, idx: number) => ({
        src: typeof img === "string" ? img : img.src || img.url,
        alt: img.alt || img.title || `GT Printing Showcase ${idx + 1}`,
        title: img.title || `Showcase ${idx + 1}`,
      }));
      return NextResponse.json({
        success: true,
        items,
        backgrounds: items.map((i: any) => i.src),
      });
    }

    // 2. Fetch projects from DB
    const dbProjects = await PortfolioProject.find({})
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .lean();

    const items: Array<{ src: string; alt: string; title: string }> = [];
    const seenUrls = new Set<string>();

    if (dbProjects && dbProjects.length > 0) {
      for (const p of dbProjects) {
        const title = p.translations?.en?.title || p.slug;
        const urls = (p.galleryUrls || []).filter(Boolean);

        for (const url of urls) {
          if (!seenUrls.has(url)) {
            seenUrls.add(url);
            items.push({
              src: url,
              alt: title,
              title: title,
            });
          }
        }
      }
    }

    // 3. Supplement with published blog post cover images if needed
    if (items.length < 6) {
      const dbBlogs = await BlogPost.find({ status: "published" })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(6)
        .lean();

      for (const b of dbBlogs) {
        if (b.coverImage && !seenUrls.has(b.coverImage)) {
          seenUrls.add(b.coverImage);
          const title = b.translations?.en?.title || b.slug;
          items.push({
            src: b.coverImage,
            alt: title,
            title: title,
          });
        }
      }
    }

    // 4. Fallback if DB has no images yet
    if (items.length === 0) {
      for (const p of PORTFOLIO_DATA) {
        for (const url of p.galleryImages) {
          if (!seenUrls.has(url)) {
            seenUrls.add(url);
            items.push({
              src: url,
              alt: p.title.en,
              title: p.title.en,
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      items: items.slice(0, 12),
      backgrounds: items.slice(0, 12).map((i) => i.src),
    });
  } catch (error: any) {
    console.error("[CAROUSEL GET ERROR]", error);
    const fallback = PORTFOLIO_DATA.flatMap((p) =>
      p.galleryImages.map((src) => ({
        src,
        alt: p.title.en,
        title: p.title.en,
      }))
    ).slice(0, 8);

    return NextResponse.json({
      success: false,
      items: fallback,
      backgrounds: fallback.map((f) => f.src),
    });
  }
}
