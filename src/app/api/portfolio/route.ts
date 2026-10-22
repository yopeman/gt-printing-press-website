import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import PortfolioProject from "@/models/PortfolioProject";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const dbProjects = await PortfolioProject.find().sort({ order: 1, createdAt: -1 }).lean();
    if (dbProjects && dbProjects.length > 0) {
      return NextResponse.json({ projects: dbProjects });
    }
  } catch (error) {
    // If DB is offline or empty, fallback to curated portfolio data
  }

  return NextResponse.json({
    projects: PORTFOLIO_DATA.map((p, idx) => ({
      _id: p.slug,
      slug: p.slug,
      serviceType:
        p.category === "signage"
          ? "large-format-signage"
          : p.category === "packaging"
          ? "packaging-solutions"
          : p.category === "publishing"
          ? "publishing-binding"
          : "offset-digital-printing",
      industry: "corporate",
      year: p.year,
      featured: p.featured,
      order: idx,
      galleryUrls: [p.coverImage, ...(p.galleryImages || [])],
      translations: {
        en: {
          title: p.title.en,
          description: p.summary.en,
          materials: p.materialsUsed.join(", "),
          clientName: p.clientName,
          location: p.location,
        },
        am: {
          title: p.title.am || p.title.en,
          description: p.summary.am || p.summary.en,
          materials: p.materialsUsed.join(", "),
          clientName: p.clientName,
          location: p.location,
        },
        om: {
          title: p.title.om || p.title.en,
          description: p.summary.om || p.summary.en,
          materials: p.materialsUsed.join(", "),
          clientName: p.clientName,
          location: p.location,
        },
      },
    })),
  });
}
