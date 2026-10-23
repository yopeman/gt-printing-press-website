import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Capability from "@/models/Capability";
import { getSession } from "@/lib/auth";
import { MACHINERY_DATA } from "@/data/machinery";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Auto-seed if database collection is empty
    const count = await Capability.countDocuments();
    if (count === 0 && MACHINERY_DATA.length > 0) {
      const seedItems = MACHINERY_DATA.map((m, idx) => ({
        name: m.name,
        slug: m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: m.category,
        manufacturer: m.manufacturer,
        origin: m.origin,
        keySpecs: m.keySpecs,
        image: m.image,
        galleryUrls: [m.image],
        mediaLinks: [],
        order: idx + 1,
        active: true,
        translations: {
          en: { description: m.description.en },
          am: { description: m.description.am },
          om: { description: m.description.om },
        },
      }));

      await Capability.insertMany(seedItems);
    }

    const capabilities = await Capability.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ capabilities });
  } catch (error: any) {
    console.error("[ADMIN CAPABILITIES GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch plant capabilities" }, { status: 500 });
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

    if (!body.name || !body.manufacturer || !body.translations?.en?.description) {
      return NextResponse.json(
        { error: "Machine name, manufacturer, and English description are required" },
        { status: 400 }
      );
    }

    const capability = await Capability.create({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: body.category || "offset",
      manufacturer: body.manufacturer,
      origin: body.origin || "Germany",
      keySpecs: body.keySpecs || [],
      image:
        body.image ||
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      galleryUrls: body.galleryUrls || [],
      mediaLinks: body.mediaLinks || [],
      order: body.order ?? 0,
      active: body.active !== false,
      translations: {
        en: {
          description: body.translations.en.description,
        },
        am: {
          description: body.translations?.am?.description || body.translations.en.description,
        },
        om: {
          description: body.translations?.om?.description || body.translations.en.description,
        },
      },
    });

    return NextResponse.json({ success: true, capability });
  } catch (error: any) {
    console.error("[ADMIN CAPABILITY POST ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to create machine capability" }, { status: 500 });
  }
}
