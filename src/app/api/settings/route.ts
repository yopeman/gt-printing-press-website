import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import SiteSetting from "@/models/SiteSetting";
import { DEFAULT_SETTINGS } from "@/lib/default-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const settingsDoc = await SiteSetting.findOne({ key: "general_config" }).lean();

    if (!settingsDoc) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS });
    }

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
    };

    return NextResponse.json({ settings: merged });
  } catch (error: any) {
    console.error("[PUBLIC SETTINGS GET ERROR]", error);
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}
