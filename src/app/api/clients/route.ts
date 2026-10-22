import { NextResponse } from "next/server";
import { getDbClientLogos } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clients = await getDbClientLogos();
    return NextResponse.json({ clients });
  } catch (error: any) {
    console.error("[PUBLIC CLIENTS GET ERROR]", error);
    return NextResponse.json({ clients: [] }, { status: 500 });
  }
}
