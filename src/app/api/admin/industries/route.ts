import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Industry from "@/models/Industry";
import { getSession } from "@/lib/auth";
import { INDUSTRIES_DATA } from "@/data/industries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Auto-seed if database collection is empty
    const count = await Industry.countDocuments();
    if (count === 0 && INDUSTRIES_DATA.length > 0) {
      await Industry.insertMany(INDUSTRIES_DATA);
    }

    const industries = await Industry.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ industries });
  } catch (error: any) {
    console.error("[ADMIN INDUSTRIES GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
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
        { error: "Slug, English title, and English description are required" },
        { status: 400 }
      );
    }

    const existing = await Industry.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { error: "An industry with this URL slug already exists" },
        { status: 409 }
      );
    }

    const industry = await Industry.create({
      slug: body.slug,
      icon: body.icon || "Building",
      image: body.image || "",
      galleryUrls: body.galleryUrls || [],
      mediaLinks: body.mediaLinks || [],
      order: body.order ?? 0,
      active: body.active !== false,
      translations: {
        en: {
          title: body.translations.en.title,
          subtitle: body.translations.en.subtitle || "",
          description: body.translations.en.description,
          products: body.translations.en.products || [],
        },
        am: {
          title: body.translations?.am?.title || body.translations.en.title,
          subtitle: body.translations?.am?.subtitle || body.translations.en.subtitle || "",
          description: body.translations?.am?.description || body.translations.en.description,
          products: body.translations?.am?.products || body.translations.en.products || [],
        },
        om: {
          title: body.translations?.om?.title || body.translations.en.title,
          subtitle: body.translations?.om?.subtitle || body.translations.en.subtitle || "",
          description: body.translations?.om?.description || body.translations.en.description,
          products: body.translations?.om?.products || body.translations.en.products || [],
        },
      },
    });

    return NextResponse.json({ success: true, industry });
  } catch (error: any) {
    console.error("[ADMIN INDUSTRY POST ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to create industry" }, { status: 500 });
  }
}
