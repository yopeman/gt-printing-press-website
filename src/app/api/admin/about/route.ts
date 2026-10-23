import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import AboutContent from "@/models/AboutContent";
import { getSession } from "@/lib/auth";
import { ABOUT_DATA } from "@/data/about";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Auto-seed if empty
    let about = await AboutContent.findOne().lean();
    if (!about) {
      about = await AboutContent.create(ABOUT_DATA);
    }

    return NextResponse.json({ about });
  } catch (error: any) {
    console.error("[ADMIN ABOUT GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch about content" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    let about = await AboutContent.findOne();
    if (!about) {
      about = await AboutContent.create(body);
    } else {
      about.heroBadge = body.heroBadge || about.heroBadge;
      about.heroTitle = body.heroTitle || about.heroTitle;
      about.heroSubtitle = body.heroSubtitle || about.heroSubtitle;
      about.storyTag = body.storyTag || about.storyTag;
      about.storyTitle = body.storyTitle || about.storyTitle;
      about.storyParagraphs = body.storyParagraphs || about.storyParagraphs;
      about.storyImage = body.storyImage || about.storyImage;
      about.galleryUrls = body.galleryUrls || about.galleryUrls;
      about.mediaLinks = body.mediaLinks || about.mediaLinks;
      about.missionTitle = body.missionTitle || about.missionTitle;
      about.missionText = body.missionText || about.missionText;
      about.visionTitle = body.visionTitle || about.visionTitle;
      about.visionText = body.visionText || about.visionText;
      about.achievements = body.achievements || about.achievements;
      about.ctaTitle = body.ctaTitle || about.ctaTitle;
      about.ctaSubtitle = body.ctaSubtitle || about.ctaSubtitle;
      await about.save();
    }

    return NextResponse.json({ success: true, about });
  } catch (error: any) {
    console.error("[ADMIN ABOUT PUT ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to update about content" }, { status: 500 });
  }
}
