import bcrypt from "bcryptjs";
import connectToDatabase from "./db";
import { User, SiteSetting, BlogPost, PortfolioProject, ClientLogo } from "@/models";

export async function seedInitialData() {
  await connectToDatabase();

  // 1. Seed Default Admin User if none exists
  const existingAdmin = await User.findOne({ email: "admin@gtprinting.et" });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("GT@Admin2026!", 10);
    await User.create({
      name: "GT System Admin",
      email: "admin@gtprinting.et",
      passwordHash,
      role: "admin",
    });
    console.log("✅ Seeded default admin user: admin@gtprinting.et");
  }

  // 2. Seed Default Site Settings
  const defaultSettings = [
    {
      key: "contact_phone",
      value: "+251 11 550 5050",
      description: "Primary office phone number",
    },
    {
      key: "contact_mobile",
      value: "+251 91 123 4567",
      description: "Direct sales & quotation mobile",
    },
    {
      key: "contact_email",
      value: "info@gtprinting.et",
      description: "General inquiry email",
    },
    {
      key: "telegram_channel",
      value: "https://t.me/gtprintingpress",
      description: "Official Telegram channel",
    },
    {
      key: "telegram_direct",
      value: "https://t.me/gtprintadmin",
      description: "Direct 1-tap Telegram sales chat",
    },
    {
      key: "office_address",
      value:
        "2nd Floor, Behind Dembel City Centre, Africa Avenue (Bole Road), Addis Ababa, Ethiopia",
      description: "Head office street address",
    },
    {
      key: "working_hours",
      value: "Monday – Saturday: 8:30 AM – 6:00 PM (EAT)",
      description: "Workshop and office operating hours",
    },
  ];

  for (const s of defaultSettings) {
    await SiteSetting.findOneAndUpdate(
      { key: s.key },
      { $setOnInsert: s },
      { upsert: true }
    );
  }

  // 3. Seed Sample Client Logos
  const clientCount = await ClientLogo.countDocuments();
  if (clientCount === 0) {
    await ClientLogo.insertMany([
      { name: "Ethiopian Airlines", logoUrl: "/clients/ethiopian-airlines.svg", category: "Aviation", order: 1 },
      { name: "ethio telecom", logoUrl: "/clients/ethio-telecom.svg", category: "Telecom", order: 2 },
      { name: "Safaricom Ethiopia", logoUrl: "/clients/safaricom.svg", category: "Telecom", order: 3 },
      { name: "Awash Bank", logoUrl: "/clients/awash-bank.svg", category: "Banking", order: 4 },
      { name: "Oromia Bank", logoUrl: "/clients/oromia-bank.svg", category: "Banking", order: 5 },
      { name: "Sheraton Addis / Marriott", logoUrl: "/clients/marriott.svg", category: "Hospitality", order: 6 },
    ]);
    console.log("✅ Seeded corporate client logos");
  }

  return { success: true, message: "Initial database seed completed" };
}
