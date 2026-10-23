import { NextRequest, NextResponse } from "next/server";
import { seedInitialData } from "@/lib/seed";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await seedInitialData();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[ADMIN SEED ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to seed data" }, { status: 500 });
  }
}
