import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
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
        { subject: regex },
        { message: regex },
      ];
    }

    const [messages, total, allMessages] = await Promise.all([
      ContactMessage.find(query).sort({ createdAt: -1 }).limit(100).lean(),
      ContactMessage.countDocuments(query),
      ContactMessage.find({}, "status").lean(),
    ]);

    const stats = {
      total: allMessages.length,
      new: allMessages.filter((m) => m.status === "New").length,
      read: allMessages.filter((m) => m.status === "Read").length,
      replied: allMessages.filter((m) => m.status === "Replied").length,
      archived: allMessages.filter((m) => m.status === "Archived").length,
    };

    return NextResponse.json({ messages, total, stats });
  } catch (error: any) {
    console.error("[ADMIN MESSAGES GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 });
  }
}
