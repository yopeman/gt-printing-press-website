import bcrypt from "bcryptjs";
import connectToDatabase from "./db";
import {
  User,
  SiteSetting,
  BlogPost,
  PortfolioProject,
  ClientLogo,
  Service,
  Capability,
  Industry,
  AboutContent,
} from "@/models";
import { SERVICES_DATA } from "@/data/services";
import { MACHINERY_DATA } from "@/data/machinery";
import { INDUSTRIES_DATA } from "@/data/industries";
import { ABOUT_DATA } from "@/data/about";

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

  // 4. Seed Services
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    const seedServices = SERVICES_DATA.map((s, idx) => ({
      slug: s.slug,
      glyph: s.glyph,
      coverImage: s.coverImage,
      galleryUrls: s.galleryImages,
      equipmentUsed: s.equipmentUsed,
      mediaLinks: [],
      order: idx + 1,
      featured: true,
      active: true,
      translations: {
        en: {
          title: s.title.en,
          shortDesc: s.shortDesc.en,
          fullDesc: s.fullDesc.en,
          typicalProducts: s.typicalProducts.en,
          finishesAndMaterials: s.finishesAndMaterials.en,
          turnaroundTime: s.turnaroundTime.en,
        },
        am: {
          title: s.title.am,
          shortDesc: s.shortDesc.am,
          fullDesc: s.fullDesc.am,
          typicalProducts: s.typicalProducts.am,
          finishesAndMaterials: s.finishesAndMaterials.am,
          turnaroundTime: s.turnaroundTime.am,
        },
        om: {
          title: s.title.om,
          shortDesc: s.shortDesc.om,
          fullDesc: s.fullDesc.om,
          typicalProducts: s.typicalProducts.om,
          finishesAndMaterials: s.finishesAndMaterials.om,
          turnaroundTime: s.turnaroundTime.om,
        },
      },
    }));
    await Service.insertMany(seedServices);
    console.log("✅ Seeded services collection");
  }

  // 5. Seed Capabilities (Machinery)
  const capabilityCount = await Capability.countDocuments();
  if (capabilityCount === 0) {
    const seedMachinery = MACHINERY_DATA.map((m, idx) => ({
      name: m.name,
      slug: m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: m.category,
      manufacturer: m.manufacturer,
      origin: m.origin,
      keySpecs: m.keySpecs,
      image: m.image,
      galleryUrls: [m.image],
      mediaLinks: [],
      order: idx + 1,
      active: true,
      translations: {
        en: { description: m.description.en },
        am: { description: m.description.am },
        om: { description: m.description.om },
      },
    }));
    await Capability.insertMany(seedMachinery);
    console.log("✅ Seeded machinery capabilities collection");
  }

  // 6. Seed Industries
  const industryCount = await Industry.countDocuments();
  if (industryCount === 0) {
    await Industry.insertMany(INDUSTRIES_DATA);
    console.log("✅ Seeded industries collection");
  }

  // 7. Seed About Content
  const aboutCount = await AboutContent.countDocuments();
  if (aboutCount === 0) {
    await AboutContent.create(ABOUT_DATA);
    console.log("✅ Seeded about content collection");
  }

  return { success: true, message: "Initial database seed completed" };
}
