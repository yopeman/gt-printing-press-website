import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import QuoteRequest from "@/models/QuoteRequest";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query: any = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { reference: regex },
        { name: regex },
        { phone: regex },
        { email: regex },
        { company: regex },
      ];
    }

    const [quotes, total, allQuotes] = await Promise.all([
      QuoteRequest.find(query).sort({ createdAt: -1 }).limit(100).lean(),
      QuoteRequest.countDocuments(query),
      QuoteRequest.find({}, { status: 1 }).lean(),
    ]);

    // Calculate pipeline statistics
    const stats = {
      total: allQuotes.length,
      new: allQuotes.filter((q) => q.status === "New").length,
      contacted: allQuotes.filter((q) => q.status === "Contacted").length,
      quoted: allQuotes.filter((q) => q.status === "Quoted").length,
      won: allQuotes.filter((q) => q.status === "Won").length,
      lost: allQuotes.filter((q) => q.status === "Lost").length,
    };

    return NextResponse.json({ quotes, total, stats });
  } catch (error: any) {
    console.error("[ADMIN QUOTES GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}
