import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { getSession } from "@/lib/auth";
import { TESTIMONIALS_DATA } from "@/data/testimonials";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Auto-seed if database collection is empty
    const count = await Testimonial.countDocuments();
    if (count === 0 && TESTIMONIALS_DATA.length > 0) {
      const seedItems = TESTIMONIALS_DATA.map((item, index) => ({
        clientName: item.name,
        role: item.role,
        company: item.company,
        avatarUrl: item.avatarUrl || "",
        order: index,
        published: true,
        translations: {
          en: { quote: item.quote.en },
          am: { quote: item.quote.am || item.quote.en },
          om: { quote: item.quote.om || item.quote.en },
        },
      }));

      await Testimonial.insertMany(seedItems);
    }

    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ testimonials });
  } catch (error: any) {
    console.error("[ADMIN TESTIMONIALS GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
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

    if (!body.clientName || !body.company || !body.translations?.en?.quote) {
      return NextResponse.json(
        { error: "Client name, company, and English quote are required" },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.create({
      clientName: body.clientName,
      role: body.role || "Executive",
      company: body.company,
      avatarUrl: body.avatarUrl || "",
      order: body.order || 0,
      published: body.published ?? true,
      translations: {
        en: { quote: body.translations.en.quote },
        am: { quote: body.translations?.am?.quote || body.translations.en.quote },
        om: { quote: body.translations?.om?.quote || body.translations.en.quote },
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    console.error("[ADMIN TESTIMONIALS POST ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to create testimonial" }, { status: 500 });
  }
}
