import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import SiteSetting from "@/models/SiteSetting";
import { getSession } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/default-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const settingsDoc = await SiteSetting.findOne({ key: "general_config" });

    if (!settingsDoc) {
      const created = await SiteSetting.create({
        key: "general_config",
        value: DEFAULT_SETTINGS,
        description: "Global company contact coordinates, phones, and operating hours",
      });
      return NextResponse.json({ settings: created.value });
    }

    // Merge missing keys with default settings to ensure new structured fields are always present
    const merged = {
      ...DEFAULT_SETTINGS,
      ...settingsDoc.value,
      contactEndpoints: settingsDoc.value?.contactEndpoints?.length
        ? settingsDoc.value.contactEndpoints
        : DEFAULT_SETTINGS.contactEndpoints,
      socialLinks: settingsDoc.value?.socialLinks?.length
        ? settingsDoc.value.socialLinks
        : DEFAULT_SETTINGS.socialLinks,
      locations: settingsDoc.value?.locations?.length
        ? settingsDoc.value.locations
        : DEFAULT_SETTINGS.locations,
      telegramBotToken: settingsDoc.value?.telegramBotToken || DEFAULT_SETTINGS.telegramBotToken,
      telegramChatId: settingsDoc.value?.telegramChatId || DEFAULT_SETTINGS.telegramChatId,
    };

    return NextResponse.json({ settings: merged });
  } catch (error: any) {
    console.error("[ADMIN SETTINGS GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();

    const updated = await SiteSetting.findOneAndUpdate(
      { key: "general_config" },
      { $set: { value: body } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings: updated.value });
  } catch (error: any) {
    console.error("[ADMIN SETTINGS POST ERROR]", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
