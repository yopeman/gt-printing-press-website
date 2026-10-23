import { Locale } from "@/types/database";

export interface AboutContentData {
  heroBadge: Record<Locale, string>;
  heroTitle: Record<Locale, string>;
  heroSubtitle: Record<Locale, string>;
  storyTag: Record<Locale, string>;
  storyTitle: Record<Locale, string>;
  storyParagraphs: Record<Locale, string[]>;
  storyImage: string;
  galleryUrls?: string[];
  mediaLinks?: Array<{ type: string; url: string; title?: string }>;
  missionTitle: Record<Locale, string>;
  missionText: Record<Locale, string>;
  visionTitle: Record<Locale, string>;
  visionText: Record<Locale, string>;
  achievements: Array<{
    title: Record<Locale, string>;
    desc: Record<Locale, string>;
  }>;
  ctaTitle: Record<Locale, string>;
  ctaSubtitle: Record<Locale, string>;
}

export const ABOUT_DATA: AboutContentData = {
  heroBadge: {
    en: "Established 2000 E.C. • Addis Ababa",
    am: "በ2000 ዓ.ም. የተመሰረተ • አዲስ አበባ",
    om: "Bara 2000 E.C. Hundeeffame • Finfinnee",
  },
  heroTitle: {
    en: "Engineering Precision Print & 3D Signage Under One Roof",
    am: "ትክክለኛ ጥራት ያለው ህትመት እና ባለ 3D ምልክቶች በአንድ ጣሪያ ስር",
    om: "Maxxansa Qulqullina Olaanaa fi Mallattoo 3D Bakka Tokkotti",
  },
  heroSubtitle: {
    en: "GT Printing Press (Advanced Digital Production Printing Plc) was founded to end the costly fragmentation between separate creative agencies, offset presses, and sign fabrication workshops.",
    am: "ጂቲ ማተሚያ ድርጅት (Advanced Digital Production Printing Plc) በዲዛይን ኤጀንሲዎች፣ በኦፍሴት ማተሚያዎች እና በምልክት ሰሪዎች መካከል ያለውን የተበታተነ አሰራር እና ወጪ ለማስቀረት የተመሰረተ ነው።",
    om: "Maxxansi GT (Advanced Digital Production Printing Plc) qisaasa baasii fi addaan ciccita oomishaa gidduu jiru hambisuuf hundeeffame.",
  },
  storyTag: {
    en: "Our Evolution & Footprint",
    am: "እድገታችን እና የስራ አሻራችን",
    om: "Guddina Keenya fi Bakka Keenya",
  },
  storyTitle: {
    en: "From High-Speed Digital Engines to an Industrial Fabrication Powerhouse",
    am: "ከፈጣን ዲጂታል ማተሚያዎች እስከ ኢንዱስትሪያል የማምረቻ አቅም",
    om: "Maxxansa Dijitaalaa Saffisaa Irraa Gara Warshaa Oomishaa Bal'aatti",
  },
  storyParagraphs: {
    en: [
      "Established in 2000 E.C. (approx. 2007/2008 G.C.), GT Printing began with an early strategic investment in high-throughput digital production printing on Africa Avenue (Bole Road), catering to rapid-turnaround corporate collateral.",
      "Recognizing our clients' frustration with managing external vendors for store signage and structural packaging, we expanded with an industrial fabrication workshop in Addis Ababa, adding heavy CNC routers, UV flatbed printing beds, and laser cutters.",
      "Today, GT Printing operates as a unified partner: from high-volume corporate financial reports and luxury packaging cartons to illuminated 3D storefront letters.",
    ],
    am: [
      "በ2000 ዓ.ም. በአፍሪካ ጎዳና (ቦሌ መንገድ) የተመሰረተው ጂቲ ማተሚያ ድርጅት፣ ፈጣን እና ጥራት ያለው የኮርፖሬት ህትመቶችን በማቅረብ ስራውን ጀመረ።",
      "ደንበኞቻችን ለሱቅ እና ለህንፃ ማስታወቂያ እንዲሁም ለማሸጊያዎች ከተለያዩ ውጫዊ አቅራቢዎች ጋር ሲሰሩ የሚደርስባቸውን እንግልት በመገንዘብ፤ የማምረቻ ፋብሪካችንን በከፍተኛ CNC ራውተሮች፣ UV ፍላትቤድ ማተሚያዎች እና ሌዘር መቁረጫዎች አሟላን።",
      "ዛሬ ጂቲ ማተሚያ የተሟላ አገልግሎት ሰጪ አጋር ሆኗል፤ ከከፍተኛ መጠን አመታዊ የፋይናንስ ሪፖርቶች እና የቅንጦት ማሸጊያዎች እስከ ባለ 3D የበሩ የህንፃ ፊት ለፊት ፊደላት ድረስ በራሳችን ማሽኖች እናመርታለን።",
    ],
    om: [
      "Bara 2000 E.C. Daandii Afrikaa (Daandii Boolee) irratti kan hundeeffame GT Printing, maxxansa saffisaa fi qulqullina qabu dhiyeessuun jalqabe.",
      "Dhaabbileen mallattoolee fi saanduqa paakeejingiif bakka hedduu deddeebi'uu isaanii hubachuun, maashinoota CNC gurguddoo, maxxansitoota UV fi kukkuttuu leezarii dabalachuun warshaa keenya bal'isne.",
      "Har'a GT Printing gabaasa waggaa herregaa, saanduqa miidhaginaa fi mallattoolee 3D ifan bakka tokkotti oomishuun tajaajila guutuu kenna.",
    ],
  },
  storyImage: "/gt-logo.png",
  galleryUrls: [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
  ],
  mediaLinks: [
    {
      type: "website",
      url: "https://order.pro.et",
      title: "Online Quote & Inquiry Portal",
    },
  ],
  missionTitle: {
    en: "Our Mission",
    am: "ተልዕኳችን",
    om: "Ergama Keenya",
  },
  missionText: {
    en: "To provide a unified, cost-effective, and technically reliable print and architectural signage production line that saves our clients time and money while preserving uncompromising brand standards.",
    am: "የደንበኞቻችንን ጊዜ እና ወጪ የሚቆጥብ፣ የብራንድ ጥራትን ሳይሸራረፍ የሚጠብቅ የተሟላ፣ አስተማማኝ እና ተመጣጣኝ የህትመት እና የአርክቴክቸራል ማስታወቂያ ማምረቻ መስመር ማቅረብ።",
    om: "Tajaajila maxxansaa fi mallattoo amansiisaa, baasii fi yeroo maamiltootaa qusatu qulqullina olaanaan dhiyeessuu.",
  },
  visionTitle: {
    en: "Our Vision",
    am: "ራዕያችን",
    om: "Mul'ata Keenya",
  },
  visionText: {
    en: "To be Ethiopia's foremost technology-driven commercial print and structural fabrication partner, setting regional standards for speed, material quality, and turnkey delivery.",
    am: "በፍጥነት፣ በጥሬ እቃ ጥራት እና በተሟላ ርክክብ የቀጠናዊ ደረጃዎችን በማውጣት በቴክኖሎጂ የተደገፈ የኢትዮጵያ ቀዳሚ የንግድ ህትመት እና ማምረቻ አጋር መሆን።",
    om: "Itoophiyaatti dhaabbata maxxansaa fi oomisha mallattoo teeknooloojiin deeggarame isa duraa ta'uu.",
  },
  achievements: [
    {
      title: {
        en: "100% In-House Execution",
        am: "100% በራሳችን ማሽኖች የሚከናወን",
        om: "100% Hojii Manatti Raawwatamu",
      },
      desc: {
        en: "Complete elimination of third-party outsourcing across printing, cutting, binding, and structural metal/acrylic fabrication.",
        am: "ህትመትን፣ መቆራረጥን፣ ጥረዛን እና የብረት/አክሪሊክ ቅርጾችን ስራዎችን ወደ ሶስተኛ ወገን ሳያወጡ ሙሉ በሙሉ በራሳችን ፋብሪካ እንሰራለን።",
        om: "Maxxansa, kutaa, qabsiisa fi hojii sibiilaa/akiriiliikii qaama sadaffaatti osoo hin kennin guutummaatti ofumaan hojjechuu.",
      },
    },
    {
      title: {
        en: "Tier-1 Institutional Track Record",
        am: "የቀዳሚ ተቋማት ተመራጭ አጋርነት",
        om: "Muuxannoo Dhaabbilee Gurguddoo Wajjin",
      },
      desc: {
        en: "Contracted visual branding partner for major commercial banks, international diplomatic missions, and leading telecom operators.",
        am: "ለዋና ዋና የንግድ ባንኮች፣ አለምአቀፍ ኤምባሲዎች እና የቴሌኮም ኦፕሬተሮች ውል ተይዞ የሚሰራ አስተማማኝ አጋር።",
        om: "Baankota gurguddoo, imbaasiiwwan idil-addunyaa fi dhaabbilee teeleekoomiitiif michuu amanamaa ta'uu.",
      },
    },
    {
      title: {
        en: "Same-Working-Day Rapid Estimates",
        am: "በስራው ቀን የሚሰጥ ፈጣን የዋጋ ግምት",
        om: "Tilmaama Baasii Guyyuma Sanaa",
      },
      desc: {
        en: "Every inquiry analyzed by real production technicians for material suitability and speed.",
        am: "እያንዳንዱ ጥያቄ በማምረቻ ባለሙያዎች በጥልቀት ተጠንቶ ለጥሬ እቃ ተስማሚነት እና ፍጥነት ፈጣን ምላሽ ይሰጣል።",
        om: "Gaaffiin kamiyyuu ogeessota oomishaatiin qoratamee deebiin saffisaan kennama.",
      },
    },
    {
      title: {
        en: "Mandatory Hard-Proof Protocol",
        am: "የግዴታ የሙከራ ህትመት ፕሮቶኮል",
        om: "Sirna Qorannoo Maxxansa Qabatamaa",
      },
      desc: {
        en: "Strict calibrated physical proofs for all color-critical commercial offset and packaging runs.",
        am: "የቀለም ጥራታቸው ወሳኝ ለሆኑ ህትመቶች እና ማሸጊያዎች ሁሉ አስቀድሞ በእጅ የሚዳሰስ ትክክለኛ የሙከራ ህትመት እናረጋግጣለን።",
        om: "Maxxansa ofseetii fi paakeejingiif osoo oomisha guutuutti hin seenin waraqaa qabatamaa irratti mirkaneessuu.",
      },
    },
  ],
  ctaTitle: {
    en: "Experience the GT In-House Difference",
    am: "የጂቲ የጥራት ልዩነትን በተግባር ይመስክሩ",
    om: "Garaagarummaa Oomisha GT Qabatamaan Hubadhaa",
  },
  ctaSubtitle: {
    en: "Schedule a visit to our Africa Avenue corporate office or book an in-person facility inspection of our fabrication floor.",
    am: "በአፍሪካ ጎዳና (ቦሌ) የሚገኘውን ዋና ቢሮአችንን ወይም የማምረቻ ፋብሪካችንን በአካል ጎብኝተው ይመልከቱ።",
    om: "Waajjira keenya Daandii Afrikaa irratti argamu yookiin warshaa oomishaa keenya daawwadhaa.",
  },
};
