import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import PortfolioProject from "@/models/PortfolioProject";
import { getSession } from "@/lib/auth";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Auto-seed if database collection is empty
    const count = await PortfolioProject.countDocuments();
    if (count === 0 && PORTFOLIO_DATA.length > 0) {
      const seedItems = PORTFOLIO_DATA.map((item, index) => ({
        slug: item.slug,
        serviceType:
          item.category === "signage"
            ? "large-format-signage"
            : item.category === "packaging"
            ? "packaging-solutions"
            : item.category === "publishing"
            ? "publishing-binding"
            : "offset-digital-printing",
        industry: "corporate",
        year: item.year || 2026,
        featured: item.featured || false,
        order: index,
        galleryUrls: item.galleryImages?.length ? item.galleryImages : [item.coverImage],
        translations: {
          en: {
            title: item.title.en,
            description: item.summary?.en || "",
            materials: (item.materialsUsed || []).join(", "),
            clientName: item.clientName,
            location: item.location || "Addis Ababa, Ethiopia",
          },
          am: {
            title: item.title.am || item.title.en,
            description: item.summary?.am || item.summary?.en || "",
            materials: (item.materialsUsed || []).join(", "),
            clientName: item.clientName,
            location: item.location || "Addis Ababa, Ethiopia",
          },
          om: {
            title: item.title.om || item.title.en,
            description: item.summary?.om || item.summary?.en || "",
            materials: (item.materialsUsed || []).join(", "),
            clientName: item.clientName,
            location: item.location || "Addis Ababa, Ethiopia",
          },
        },
      }));

      await PortfolioProject.insertMany(seedItems);
    }

    const projects = await PortfolioProject.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("[ADMIN PORTFOLIO GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch portfolio projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    if (!body.slug || !body.translations?.en?.title || !body.translations?.en?.description) {
      return NextResponse.json(
        { error: "Slug and English title/description are required" },
        { status: 400 }
      );
    }

    const existing = await PortfolioProject.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { error: "A project with this URL slug already exists" },
        { status: 409 }
      );
    }

    const project = await PortfolioProject.create({
      slug: body.slug,
      serviceType: body.serviceType || "offset-digital-printing",
      industry: body.industry || "corporate",
      year: body.year || 2026,
      featured: Boolean(body.featured),
      order: body.order || 0,
      galleryUrls: body.galleryUrls && body.galleryUrls.length > 0
        ? body.galleryUrls
        : ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80"],
      translations: {
        en: {
          title: body.translations.en.title,
          description: body.translations.en.description,
          materials: body.translations.en.materials || "",
          clientName: body.translations.en.clientName || "",
          location: body.translations.en.location || "Addis Ababa, Ethiopia",
        },
        am: {
          title: body.translations?.am?.title || body.translations.en.title,
          description: body.translations?.am?.description || body.translations.en.description,
          materials: body.translations?.am?.materials || body.translations.en.materials || "",
          clientName: body.translations?.am?.clientName || body.translations.en.clientName || "",
          location: body.translations?.am?.location || body.translations.en.location || "Addis Ababa, Ethiopia",
        },
        om: {
          title: body.translations?.om?.title || body.translations.en.title,
          description: body.translations?.om?.description || body.translations.en.description,
          materials: body.translations?.om?.materials || body.translations.en.materials || "",
          clientName: body.translations?.om?.clientName || body.translations.en.clientName || "",
          location: body.translations?.om?.location || body.translations.en.location || "Addis Ababa, Ethiopia",
        },
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("[ADMIN PORTFOLIO POST ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}
