import { NextResponse } from "next/server";
import { getDbPortfolioProjects } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getDbPortfolioProjects();
    return NextResponse.json({ projects });
  } catch (err: any) {
    console.error("[PUBLIC PORTFOLIO GET ERROR]", err);
    return NextResponse.json({ projects: [] }, { status: 500 });
  }
}
