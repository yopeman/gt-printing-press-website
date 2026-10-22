import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import SiteSetting from "@/models/SiteSetting";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS = {
  companyName: "GT Printing Press (Advanced Digital Production Printing Plc)",
  phonePrimary: "+251 91 123 4567",
  phoneSecondary: "+251 11 661 2345",
  emailGeneral: "info@gtprintingpress.com",
  emailQuotes: "sales@gtprintingpress.com",
  telegramChannel: "@gtprintingethiopia",
  telegramAdminDesk: "@gtprintadmin",
  addressBole: "Africa Avenue (Bole Road), Behind Edna Mall / Tele Medhanialem, Addis Ababa, Ethiopia",
  latitude: 8.9954,
  longitude: 38.7885,
  workingHoursWeekday: "Monday – Friday: 8:00 AM – 7:30 PM",
  workingHoursSaturday: "Saturday: 8:30 AM – 5:00 PM",
  workingHoursSunday: "Sunday: Closed (On-call for emergency production)",
  turnaroundGuarantee: "Same-Working-Day Estimation Guarantee",
};

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

    return NextResponse.json({ settings: settingsDoc.value });
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
