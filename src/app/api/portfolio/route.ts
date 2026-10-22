import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import PortfolioProject from "@/models/PortfolioProject";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const dbProjects = await PortfolioProject.find({}).sort({ order: 1, createdAt: -1 }).lean();

    if (!dbProjects || dbProjects.length === 0) {
      return NextResponse.json({ projects: PORTFOLIO_DATA });
    }

    // Format DB projects to match frontend expectations
    const formattedDb = dbProjects.map((p: any) => {
      const cover = p.galleryUrls?.[0] || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80";
      return {
        slug: p.slug,
        category: p.serviceType || "signage",
        categoryLabel: {
          en: (p.serviceType || "Signage").replace(/-/g, " "),
          am: (p.serviceType || "ሳይኔጅ").replace(/-/g, " "),
          om: (p.serviceType || "Mallattoo").replace(/-/g, " "),
        },
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
          ? p.translations.en.materials.split(",").map((m: string) => m.trim())
          : ["Industrial Offset", "Custom Finishing"],
        coverImage: cover,
        galleryImages: p.galleryUrls && p.galleryUrls.length > 0 ? p.galleryUrls : [cover],
        featured: Boolean(p.featured),
        tags: p.tags || [],
        mediaLinks: p.mediaLinks || [],
      };
    });

    return NextResponse.json({ projects: formattedDb });
  } catch (err: any) {
    console.error("[PUBLIC PORTFOLIO GET ERROR]", err);
    return NextResponse.json({ projects: PORTFOLIO_DATA });
  }
}
