import { Locale } from "@/types/database";

export interface PortfolioItem {
  slug: string;
  category: "signage" | "packaging" | "publishing" | "branding";
  categoryLabel: Record<Locale, string>;
  title: Record<Locale, string>;
  clientName: string;
  year: number;
  location: string;
  summary: Record<Locale, string>;
  fullDescription: Record<Locale, string>;
  materialsUsed: string[];
  coverImage: string;
  galleryImages: string[];
  featured: boolean;
}

export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    slug: "awash-bank-hq-architectural-signage",
    category: "signage",
    categoryLabel: {
      en: "Signage & 3D",
      am: "ሳይኔጅ እና 3D",
      om: "Mallattoo fi 3D",
    },
    title: {
      en: "Awash Bank Headquarters 3D Illuminated Signage",
      am: "የአዋሽ ባንክ ዋና መ/ቤት 3D የበራ ሳይኔጅ",
      om: "Mallattoo 3D Ifa Qabu kan Waajjira Muummee Baankii Hawaash",
    },
    clientName: "Awash Bank S.C.",
    year: 2025,
    location: "Ras Abebe Aregay Street, Addis Ababa",
    summary: {
      en: "Turnkey architectural facade branding featuring 2.5m precision CNC acrylic channel letters with Samsung IP67 LED modules.",
      am: "በሲኤንሲ የተሰራ የ2.5 ሜትር የ3D ፊደላት ሳይኔጅ እና ከፍተኛ ጥራት ያለው የLED መብራት ተከላ።",
      om: "Qubeelee akiriilikii 3D fi ifa LED ammayyaa kan fuula gamoo irratti dhaabbate.",
    },
    fullDescription: {
      en: "Fabricated entirely in our industrial workshop, this monumental signage project required structural aluminum framework, vacuum-formed ruby-red acrylic faces matching Awash Bank's brand Pantone, and energy-efficient LED backlighting engineered to withstand severe weather conditions.",
      am: "ሙሉ በሙሉ በራሳችን ፋብሪካ የተመረተው ይህ ፕሮጀክት የአልኮቦንድ ማዕቀፍ፣ በባንኩ የቀለም ኮድ መሰረት የተሰራ አክሬሊክ እና ለዝናብ የማይበላሽ የLED መብራት ዝርጋታን ያካተተ ነው።",
      om: "Warshaa keenya keessatti kan hojjetame mallattoon kun alumiiniyeemii, akiriilikii diimaa fi ifa LED qilleensa dandamatu of keessaa qaba.",
    },
    materialsUsed: ["Cast Acrylic 15mm", "Alucobond Composite Panel", "Samsung IP67 LEDs", "Automotive Polyurethane Coating"],
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80",
    ],
    featured: true,
  },
  {
    slug: "ethiopian-airlines-in-flight-magazine",
    category: "publishing",
    categoryLabel: {
      en: "Publishing",
      am: "ህትመት እና ጥረዛ",
      om: "Maxxansa Barruulee",
    },
    title: {
      en: "Ethiopian Airlines Premium In-Flight Magazine Run",
      am: "የኢትዮጵያ አየር መንገድ የጉዞ መጽሔት ህትመት",
      om: "Maxxansa Barruu Imala Daandii Qilleensa Itoophiyaa",
    },
    clientName: "Ethiopian Airlines Group",
    year: 2026,
    location: "Bole International Airport, Addis Ababa",
    summary: {
      en: "120-page full-color publication with soft-touch matte lamination, spot UV embellishments, and PUR square binding.",
      am: "120 ገጽ ያለው ባለሙሉ ቀለም መጽሔት በማት ላሚኔሽን፣ በስፖት ዩቪ እና በፒዩአር ሙጫ ጥረዛ የተዘጋጀ።",
      om: "Barruu fuula 120 qabu kan halluu guutuu, laamineeshinii fi qabsiisa PUR ammayyaatiin maxxanfame.",
    },
    fullDescription: {
      en: "High-volume print edition produced on our Heidelberg Speedmaster press on 130gsm FSC-certified interior art paper and 300gsm laminated cover. Color density audited across all sheet positions to guarantee photographic rendering of Ethiopia's travel destinations.",
      am: "በሃይድልበርግ ስፒድማስተር ማሽን በ130 ግራም አርት ወረቀት እና በ300 ግራም ማት ሽፋን የታተመ የኢትዮጵያን ውብ የቱሪስት መስህቦች የሚያሳይ መጽሔት።",
      om: "Maashina Heidelberg Speedmaster irratti waraqaa qulqulluu 130gsm fi qola 300gsm laamineeshinii qabuun kan maxxanfame.",
    },
    materialsUsed: ["130gsm Gloss Art Paper", "300gsm Art Card", "Soft-Touch Thermal Film", "Spot UV Varnish"],
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    ],
    featured: true,
  },
  {
    slug: "specialty-coffee-rigid-gift-boxes",
    category: "packaging",
    categoryLabel: {
      en: "Packaging",
      am: "ፓኬጂንግ",
      om: "Paakeejingii",
    },
    title: {
      en: "Yirgacheffe Single-Origin Luxury Coffee Cartons",
      am: "የይርጋጨፌ ልዩ ቡና የቅንጦት ማሸጊያ ሳጥኖች",
      om: "Saanduqa Kennaa Buna Yirgaacaffee Addaa",
    },
    clientName: "Bole Artisan Roasters Plc",
    year: 2025,
    location: "Addis Ababa / Export",
    summary: {
      en: "Rigid magnetic closure presentation cartons wrapped in textured uncoated paper with gold foil stamping and debossed typography.",
      am: "መግነጢሳዊ መክፈቻ ያላቸው ጠንካራ የስጦታ ሳጥኖች ከወርቅ ፎይል እና ከታሸገ ጽሁፍ ጋር።",
      om: "Saanduqa kennaa cimaa cufaa maagneetiitiin hojjetame fi fooyilii warqeen miidhagfame.",
    },
    fullDescription: {
      en: "Engineered for international specialty coffee export, these boxes feature 2mm rigid board cores, precision V-groove folding corners for sharp 90-degree edges, internal velvet-flocked custom inserts, and custom hot-stamped gold foil logo branding.",
      am: "ለዓለም አቀፍ የቡና ኤክስፖርት የተዘጋጁ እነዚህ ሳጥኖች የ2 ሚሜ ጠንካራ ካርቶን፣ የቬልቬት የውስጥ ማስቀመጫ እና የወርቅ ፎይል ማህተም አላቸው።",
      om: "Gabaa buna addunyaatiif kan qophaa'e kaartoonii 2mm, keessa leemmana qabu fi fooyilii warqeen kan qophaa'e.",
    },
    materialsUsed: ["2.0mm Greyboard Core", "140gsm Textured Wibalin Wrap", "Metallic Gold Foil", "Neodymium Magnets"],
    coverImage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    ],
    featured: true,
  },
  {
    slug: "safaricom-ethiopia-nationwide-retail-displays",
    category: "branding",
    categoryLabel: {
      en: "Corporate Branding",
      am: "የድርጅት መለያ",
      om: "Eenyummeessa Dhaabbataa",
    },
    title: {
      en: "Safaricom Regional Store Brand Rollout",
      am: "የሳፋሪኮም የሱቆች መለያ እና ማስታወቂያ ዝርጋታ",
      om: "Maxxansa Mallattoo Suuqii Safaricom Itoophiyaa",
    },
    clientName: "Safaricom Telecommunications Ethiopia",
    year: 2025,
    location: "Addis Ababa, Hawassa & Dire Dawa",
    summary: {
      en: "Multi-city turnkey rollout of acrylic directional signs, counter displays, backlit lightboxes, and promotional merchandise.",
      am: "በአዲስ አበባ፣ በሀዋሳ እና በድሬዳዋ የተከናወነ የአክሬሊክ፣ የብርሃን ቦርዶች እና የሱቅ መለያ ስራዎች።",
      om: "Finfinnee, Hawaasaa fi Dirre Dhawaatti dhaabbii mallattoo akiriilikii fi gabatee ifaa.",
    },
    fullDescription: {
      en: "GT Printing coordinated rapid digital and fabrication delivery across 45 retail service centers, unifying shopfront lightboxes, counter top promotional stands, and staff executive stationery under rigid brand color specifications.",
      am: "ጂቲ ማተሚያ ቤት በ45 የሽያጭ ማዕከላት ውስጥ የሱቅ ፊት ማስታወቂያዎችን፣ የካውንተር ስታንዶችን እና የጽህፈት መሳሪያዎችን በጥራት አጠናቆ አስረክቧል።",
      om: "Suuqilee 45 keessatti mallattoolee fuula duraa, istaandii beeksisaa fi meeshaalee barreeffamaa qulqullinaan dhiyeessine.",
    },
    materialsUsed: ["Forex PVC Sheet 10mm", "LED Slim Lightboxes", "Alucobond Sign Paneling", "Cast Vinyl 3M"],
    coverImage: "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    ],
    featured: false,
  },
  {
    slug: "marriott-executive-stationery-collateral",
    category: "branding",
    categoryLabel: {
      en: "Corporate Branding",
      am: "የድርጅት መለያ",
      om: "Eenyummeessa Dhaabbataa",
    },
    title: {
      en: "Luxury Hotel Hospitality Stationery & Keycard Wallets",
      am: "የቅንጦት ሆቴል የካርድ መያዣ እና የጽህፈት መለያ እቃዎች",
      om: "Borseetti Kaardii Hoteela Qulqulluu fi Sanada Dhaabbataa",
    },
    clientName: "International Luxury Hotel Group",
    year: 2025,
    location: "Kazanchis, Addis Ababa",
    summary: {
      en: "Bespoke linen-textured presentation folders, gold foiled keycard sleeves, and custom room directory binders.",
      am: "በሊነን ወረቀት፣ በወርቅ ፎይል እና በቆዳ ጥረዛ የተዘጋጁ የክፍል ካርድ መያዣዎች እና የሆቴል መረጃ ደብተሮች።",
      om: "Waraqaa liinenii fi fooyilii warqeen kan qophaa'e borseetti kaardii fi barruu hoteelaa.",
    },
    fullDescription: {
      en: "Exquisite hotel collateral suite produced to international five-star hospitality standards with watermarked stationery, blind debossed envelopes, and foil-blocked leather directory folios.",
      am: "የአምስት ኮከብ ደረጃቸውን የጠበቁ የሆቴል መስተንግዶ እቃዎች በልዩ የወረቀት ጥራት እና በታሸገ የብራንድ ማህተም የተሰሩ።",
      om: "Sadarkaa hoteela urjii shanii kan eeggate meeshaalee waraqaa fi gogaa bareedaa.",
    },
    materialsUsed: ["Conqueror Textured Wove 300gsm", "Metallic Foil Stamping", "Blind Embossing Matrix"],
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
    ],
    featured: false,
  },
];
