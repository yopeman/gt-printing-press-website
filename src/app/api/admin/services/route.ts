import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Service from "@/models/Service";
import { getSession } from "@/lib/auth";
import { SERVICES_DATA } from "@/data/services";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Auto-seed if database collection is empty
    const count = await Service.countDocuments();
    if (count === 0 && SERVICES_DATA.length > 0) {
      const seedItems = SERVICES_DATA.map((s, idx) => ({
        slug: s.slug,
        glyph: s.glyph,
        coverImage: s.coverImage,
        galleryUrls: s.galleryImages,
        equipmentUsed: s.equipmentUsed,
        mediaLinks: [],
        order: idx + 1,
        featured: true,
        active: true,
        translations: {
          en: {
            title: s.title.en,
            shortDesc: s.shortDesc.en,
            fullDesc: s.fullDesc.en,
            typicalProducts: s.typicalProducts.en,
            finishesAndMaterials: s.finishesAndMaterials.en,
            turnaroundTime: s.turnaroundTime.en,
          },
          am: {
            title: s.title.am,
            shortDesc: s.shortDesc.am,
            fullDesc: s.fullDesc.am,
            typicalProducts: s.typicalProducts.am,
            finishesAndMaterials: s.finishesAndMaterials.am,
            turnaroundTime: s.turnaroundTime.am,
          },
          om: {
            title: s.title.om,
            shortDesc: s.shortDesc.om,
            fullDesc: s.fullDesc.om,
            typicalProducts: s.typicalProducts.om,
            finishesAndMaterials: s.finishesAndMaterials.om,
            turnaroundTime: s.turnaroundTime.om,
          },
        },
      }));

      await Service.insertMany(seedItems);
    }

    const services = await Service.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ services });
  } catch (error: any) {
    console.error("[ADMIN SERVICES GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
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

    if (!body.slug || !body.translations?.en?.title || !body.translations?.en?.shortDesc) {
      return NextResponse.json(
        { error: "Slug and English title/short description are required" },
        { status: 400 }
      );
    }

    const existing = await Service.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { error: "A service with this URL slug already exists" },
        { status: 409 }
      );
    }

    const service = await Service.create({
      slug: body.slug,
      glyph: body.glyph || "offset-roller",
      coverImage:
        body.coverImage ||
        "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80",
      galleryUrls: body.galleryUrls || [],
      equipmentUsed: body.equipmentUsed || [],
      mediaLinks: body.mediaLinks || [],
      order: body.order ?? 0,
      featured: Boolean(body.featured),
      active: body.active !== false,
      translations: {
        en: {
          title: body.translations.en.title,
          shortDesc: body.translations.en.shortDesc,
          fullDesc: body.translations.en.fullDesc || body.translations.en.shortDesc,
          typicalProducts: body.translations.en.typicalProducts || [],
          finishesAndMaterials: body.translations.en.finishesAndMaterials || [],
          turnaroundTime: body.translations.en.turnaroundTime || "2–4 working days",
        },
        am: {
          title: body.translations?.am?.title || body.translations.en.title,
          shortDesc: body.translations?.am?.shortDesc || body.translations.en.shortDesc,
          fullDesc: body.translations?.am?.fullDesc || body.translations.en.fullDesc || "",
          typicalProducts: body.translations?.am?.typicalProducts || body.translations.en.typicalProducts || [],
          finishesAndMaterials: body.translations?.am?.finishesAndMaterials || body.translations.en.finishesAndMaterials || [],
          turnaroundTime: body.translations?.am?.turnaroundTime || body.translations.en.turnaroundTime || "",
        },
        om: {
          title: body.translations?.om?.title || body.translations.en.title,
          shortDesc: body.translations?.om?.shortDesc || body.translations.en.shortDesc,
          fullDesc: body.translations?.om?.fullDesc || body.translations.en.fullDesc || "",
          typicalProducts: body.translations?.om?.typicalProducts || body.translations.en.typicalProducts || [],
          finishesAndMaterials: body.translations?.om?.finishesAndMaterials || body.translations.en.finishesAndMaterials || [],
          turnaroundTime: body.translations?.om?.turnaroundTime || body.translations.en.turnaroundTime || "",
        },
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    console.error("[ADMIN SERVICES POST ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to create service" }, { status: 500 });
  }
}
