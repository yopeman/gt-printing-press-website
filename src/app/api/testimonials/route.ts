import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import ClientLogo from "@/models/ClientLogo";
import { TESTIMONIALS_DATA } from "@/data/testimonials";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const count = await Testimonial.countDocuments();

    // Auto-seed if collection is empty
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

    const testimonials = await Testimonial.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const clientLogos = await ClientLogo.find().sort({ order: 1, createdAt: 1 }).lean();

    return NextResponse.json({ testimonials, clientLogos });
  } catch (error: any) {
    console.error("[PUBLIC TESTIMONIALS GET ERROR]", error);
    // Graceful fallback to static data if MongoDB is unreachable
    const fallback = TESTIMONIALS_DATA.map((item, index) => ({
      _id: `static-${item.id}`,
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
    return NextResponse.json({ testimonials: fallback, clientLogos: [] });
  }
}
