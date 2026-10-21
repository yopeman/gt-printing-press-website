import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { QuoteRequest, BlogPost, PortfolioProject, User, SiteSetting } from "@/models";

export async function GET() {
  const timestamp = new Date().toISOString();
  let dbStatus = "disconnected";
  let dbError = null;

  try {
    const conn = await connectToDatabase();
    if (conn.connection.readyState === 1) {
      dbStatus = "connected";
    }
  } catch (error: any) {
    dbStatus = "error";
    dbError = error?.message || "Failed to connect to MongoDB";
  }

  return NextResponse.json({
    status: "ok",
    phase: "Phase 1: Foundation, Themes, i18n & Data Models",
    timestamp,
    locales: ["en", "am", "om"],
    themes: ["light", "dark", "night", "system"],
    database: {
      status: dbStatus,
      error: dbError,
      registeredModels: [
        QuoteRequest.modelName,
        BlogPost.modelName,
        PortfolioProject.modelName,
        User.modelName,
        SiteSetting.modelName,
      ],
    },
  });
}
