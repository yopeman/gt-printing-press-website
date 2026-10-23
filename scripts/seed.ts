import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { SERVICES_DATA } from "../src/data/services";
import { MACHINERY_DATA } from "../src/data/machinery";
import { INDUSTRIES_DATA } from "../src/data/industries";
import { ABOUT_DATA } from "../src/data/about";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gt_printing";

async function run() {
  console.log("Connecting to:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB!");

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("No db connection");
  }

  // 1. Services
  const servicesCol = db.collection("services");
  const serviceCount = await servicesCol.countDocuments();
  console.log(`Current services count: ${serviceCount}`);
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await servicesCol.insertMany(seedServices);
    console.log("✅ Seeded services into MongoDB!");
  }

  // 2. Capabilities (Machinery)
  const capCol = db.collection("capabilities");
  const capCount = await capCol.countDocuments();
  console.log(`Current capabilities count: ${capCount}`);
  if (capCount === 0) {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await capCol.insertMany(seedMachinery);
    console.log("✅ Seeded capabilities into MongoDB!");
  }

  // 3. Industries
  const indCol = db.collection("industries");
  const indCount = await indCol.countDocuments();
  console.log(`Current industries count: ${indCount}`);
  if (indCount === 0) {
    const seedIndustries = INDUSTRIES_DATA.map((ind) => ({
      ...ind,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await indCol.insertMany(seedIndustries);
    console.log("✅ Seeded industries into MongoDB!");
  }

  // 4. About Content
  const aboutCol = db.collection("aboutcontents");
  const aboutCount = await aboutCol.countDocuments();
  console.log(`Current aboutcontents count: ${aboutCount}`);
  if (aboutCount === 0) {
    await aboutCol.insertOne({
      ...ABOUT_DATA,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Seeded about content into MongoDB!");
  }

  console.log("Seed verification complete!");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
