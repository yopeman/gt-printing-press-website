import { Locale } from "@/types/database";

export interface BlogPostItem {
  slug: string;
  category: string;
  categoryLabel: Record<Locale, string>;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  content: Record<Locale, string>;
  author: string;
  authorRole: string;
  publishedDate: string;
  readTime: string;
  coverImage: string;
  tags: string[];
}

export const BLOG_DATA: BlogPostItem[] = [
  {
    slug: "print-ready-artwork-preparation-guide",
    category: "prepress",
    categoryLabel: {
      en: "Pre-Press & Technical",
      am: "ቅድመ-ህትመት እና ቴክኒካል",
      om: "Qophii Maxxansaa",
    },
    title: {
      en: "Preparing Print-Ready Artwork: The Essential Guide to Bleeds, CMYK, and Vectors",
      am: "ለህትመት ዝግጁ የሆነ ዲዛይን ማዘጋጀት፡ የብሊድ፣ CMYK እና ቬክተር መመሪያ",
      om: "Faayilii Maxxansaaf Qopheessuu: Qajeelfama Bleed, CMYK fi Veektaraa",
    },
    excerpt: {
      en: "Avoid blurry raster graphics and costly trimming errors. Learn how to configure 3mm bleeds, CMYK color spaces, and outline fonts properly.",
      am: "የተዛባ ህትመት እና የቆረጣ ስህተቶችን ለማስወገድ የ3 ሚሜ ብሊድ፣ የCMYK የቀለም አይነት እና የፊደል አቀማመጥን እንዴት ማስተካከል እንደሚቻል ይወቁ።",
      om: "Dogongora kutaa fi qulqullina dhabuu faayilaa hambisuuf akkaataa bleed 3mm fi halluu CMYK itti sirreeffamu baradhaa.",
    },
    content: {
      en: `
### 1. RGB vs. CMYK Color Spaces

Digital monitors emit light in the **RGB (Red, Green, Blue)** spectrum, whereas commercial printing presses deposit physical ink droplets in **CMYK (Cyan, Magenta, Yellow, Key/Black)**. 

When you design artwork in RGB and submit it without conversion, bright luminous greens, cyans, and neon pinks cannot be replicated with physical pigment, resulting in a dull or shifted print. Always design in or convert your color space to **CMYK (FOGRA39 or GRACoL standard)** before finalizing files.

### 2. Bleed and Safe Margins (The 3mm Rule)

During high-speed guillotine cutting (Polar Mohr), stacks of 500 sheets can experience microscopic mechanical shifts (0.5mm to 1.0mm). 
- **Bleed Zone:** Extend all background colors and photos **3mm past the final cut line** (trim edge).
- **Safe Zone:** Keep all critical text, logos, and phone numbers at least **4mm inside the trim edge**.

### 3. Image Resolution: The 300 DPI Standard

Images sourced from websites are typically 72 DPI (dots per inch), designed for rapid screen loading. If printed on a Heidelberg press, 72 DPI images will appear heavily pixelated and soft. Always ensure all placed photographic assets are at least **300 DPI at 100% printed scale**.

### 4. Font Outlining & Vector Preservation

To ensure typography renders exactly as you intended regardless of missing font libraries on the press RIP server, select all type and **Create Outlines (Ctrl+Shift+O / Cmd+Shift+O)** in Adobe Illustrator or InDesign.
      `,
      am: `
### 1. የRGB እና የCMYK የቀለም ልዩነት

የኮምፒውተር ስክሪኖች ምስሎችን የሚያሳዩት በ**RGB** ብርሃን ሲሆን የህትመት ማሽኖች ደግሞ ቀለማትን የሚያዋህዱት በ**CMYK** ቀለሞች ነው። ፋይልዎን በCMYK ካላዘጋጁ በስክሪኑ ላይ ያዩት ቀለም በህትመት ወቅት ሊለወጥ ይችላል።

### 2. የብሊድ (Bleed) እና የደህንነት መስመር (3 ሚሜ ህግ)

መጽሐፍት ወይም ካርዶች በሚቆረጡበት ወቅት ጽሁፍ እንዳይቆረጥ ሁሉም ጠቃሚ ጽሁፎች እና ሎጎዎች ከመቁረጫው መስመር ቢያንስ **4 ሚሜ ወደ ውስጥ** መሆን አለባቸው። የጀርባው ቀለም ደግሞ ከመቁረጫው መስመር **3 ሚሜ ወደ ውጭ** መራዘም አለበት።

### 3. የፎቶ ጥራት (300 DPI)

ከኢንተርኔት የሚወርዱ ፎቶዎች ብዙውን ጊዜ 72 DPI ስለሆኑ ለህትመት ሲውሉ ይደበዝዛሉ። ለጥራት ህትመት የሚውሉ ፎቶዎች ቢያንስ **300 DPI** ጥራት ሊኖራቸው ይገባል።
      `,
      om: `
### 1. Garaagarummaa Halluu RGB fi CMYK

Iskiriiniin kompiitaraa halluu **RGB** yoo agarsiisu, maashiniin maxxansaa immoo halluu **CMYK** gargaarama. Faayilii keessan maxxansaan dura gara CMYKtti jijjiiruun barbaachisaadha.

### 2. Seera Bleed (3mm)

Waraqaan yeroo muramu barreeffamni akka hin citneef barreeffamoota barbaachisoo sarara murtii irraa **4mm gara keessaatti** qabaachuu qaba. Halluun duubaa immoo **3mm gara alaatti** dabalamee qophaa'uu qaba.

### 3. Qulqullina Suuraa (300 DPI)

Suuraaleen interneetii irraa bu'an baay'inaan 72 DPI waan ta'aniif maxxansa irratti ni bada. Suuraan maxxansaaf ta'u yoo xiqqaate **300 DPI** ta'uu qaba.
      `,
    },
    author: "Dawit Mengistu",
    authorRole: "Senior Pre-Press Engineer at GT Printing",
    publishedDate: "October 15, 2026",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1200&q=80",
    tags: ["Prepress", "CMYK", "Bleeds", "Graphic Design"],
  },
  {
    slug: "paper-stocks-and-luxury-finishes-guide",
    category: "finishing",
    categoryLabel: {
      en: "Materials & Finishes",
      am: "የወረቀት እና ማጠናቀቂያ አይነቶች",
      om: "Waraqaa fi Xumura",
    },
    title: {
      en: "Paper Stocks and Luxury Finishes: Soft-Touch, Foil, and Spot UV Decoded",
      am: "የወረቀት አይነቶች እና የቅንጦት ማጠናቀቂያዎች፡ ሶፍት-ተች፣ ፎይል እና ስፖት ዩቪ",
      om: "Gosa Waraqaa fi Xumura Bareedinaa: Laamineeshinii, Fooyilii fi Ispootti UV",
    },
    excerpt: {
      en: "How to elevate corporate presentation folders, product packaging, and stationery with tactical finishes that captivate the senses.",
      am: "የድርጅት ፎልደሮችን፣ የምርት ማሸጊያዎችን እና ካርዶችን በልዩ የማት፣ የፎይል እና የስፖት ዩቪ ማጠናቀቂያዎች እንዴት ማሳመር እንደሚቻል ይወቁ።",
      om: "Akkaataa kaartoonii fi sanadoota dhaabbataa itti laamineeshinii luuccaa fi fooyilii warqeetiin miidhagsan baruuf.",
    },
    content: {
      en: `
### The Weight Spectrum: GSM Explained

Grams per Square Meter (GSM) determines the thickness and rigidity of paper:
- **80–100 GSM:** Standard office letterheads and administrative forms.
- **130–170 GSM:** High-impact flyer inserts, magazine interior pages, and folded brochures.
- **250–350 GSM:** Book covers, presentation folders, and retail folding cartons.
- **400+ GSM & Rigid Board:** Luxury business cards and rigid gift boxes.

### Luxury Finishes

1. **Soft-Touch Matte Lamination:** Provides a velvet-like tactile texture while protecting ink from scuffs and fingerprints.
2. **Spot UV Varnish:** High-gloss transparent polymer applied over select logos or headings, creating a dramatic contrast against matte surfaces.
3. **Hot Foil Stamping:** Pressure-applied metallic foils (Gold, Silver, Copper, or Ruby) that gleam in reflective lighting.
      `,
      am: `
### የወረቀት ክብደት (GSM) ማብራሪያ

የወረቀት ውፍረት በግራም (GSM) ይለካል፡
- **80–100 ግራም:** ለቢሮ ሰነዶች እና ደብዳቤዎች።
- **130–170 ግራም:** ለፍላየሮች እና ለመጽሔት የውስጥ ገጾች።
- **250–350 ግራም:** ለመጽሐፍ ሽፋኖች፣ ለፎልደሮች እና ለሳጥኖች።
- **400+ ግራም:** ለልዩ የንግድ ካርዶች እና ጠንካራ የስጦታ ሳጥኖች።

### የማጠናቀቂያ አይነቶች

1. **ሶፍት-ተች ማት ላሚኔሽን:** እንደ ቬልቬት የለሰለሰ እና የማያንጸባርቅ ውብ ሽፋን ይሰጣል።
2. **ስፖት ዩቪ ቫርኒሽ:** በሎጎ ወይም በጽሁፍ ላይ ብቻ በማንጸባረቅ ልዩ ውበት ይፈጥራል።
3. **የወርቅ እና የብር ፎይል:** የሚያብረቀርቅ የብረት ፎይል ህትመት።
      `,
      om: `
### Ulfaatina Waraqaa (GSM)

Ulfaatinni waraqaa giraamiin (GSM) lakkaa'ama:
- **80–100 GSM:** Waraqaa biiroo fi xalayaa daldalaa.
- **130–170 GSM:** Fulaayarii fi fuula keessaa barruulee.
- **250–350 GSM:** Qola kitaabaa, foolderii fi saanduqa.
- **400+ GSM:** Kaardii daldalaa addaa fi saanduqa kennaa.
      `,
    },
    author: "Selamawit Tadesse",
    authorRole: "Production Specialist at GT Printing",
    publishedDate: "October 18, 2026",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80",
    tags: ["Finishing", "Packaging", "Paper Stocks", "Luxury"],
  },
  {
    slug: "ai-in-commercial-design-and-print-workflows",
    category: "technology",
    categoryLabel: {
      en: "Technology & Industry",
      am: "ቴክኖሎጂ እና ኢንዱስትሪ",
      om: "Teeknooloojii fi Maxxansa",
    },
    title: {
      en: "How AI is Reshaping Commercial Graphic Design and Print Production in 2026",
      am: "አርቲፊሻል ኢንተለጀንስ (AI) በ2026 የህትመት እና የዲዛይን ስራን እንዴት እየቀየረው ነው?",
      om: "AI Akkaataa Dizaayinii fi Maxxansa Daldalaa Bara 2026 Itti Jijjiiru",
    },
    excerpt: {
      en: "From generative layout iterations to AI-driven automated color balancing and pre-press diagnostic scanning, discover the future of turnkey printing.",
      am: "ከዲዛይን ፈጠራ ጀምሮ እስከ አውቶሜትድ የቀለም ማስተካከያ እና የፕሌት ዝግጅት ድረስ AI በህትመት ኢንዱስትሪ ውስጥ እያመጣ ያለውን ለውጥ ይወቁ።",
      om: "Dizaayinii haaromsuu irraa kaasee hanga sirreeffama halluu ofiin hojjetutti gumaacha AI maxxansa keessatti.",
    },
    content: {
      en: `
### The Symbiosis of AI and High-End Print

While digital media moves at the speed of milliseconds, high-end commercial print retains permanence and tactile authority. In 2026, artificial intelligence is not replacing print craft—it is eliminating the manual friction between a client's creative concept and the physical press cylinder.

### 1. Automated Pre-Flight Diagnostics

AI-powered pre-flight software now inspects incoming vector and raster artwork in seconds, automatically repairing low-resolution bleed extensions via generative fill while maintaining raster sharpness.

### 2. Predictive Color Calibration

Modern press engines use machine-learning algorithms to predict thermal plate dot gain based on ambient shop humidity, paper stock absorption profiles, and ink viscosity, ensuring the 100,000th copy matches the initial signed contract proof.
      `,
      am: `
### የAI እና የህትመት ጥበብ ቅንጅት

በ2026 አርቲፊሻል ኢንተለጀንስ የህትመት ጥበብን ከመተካት ይልቅ ስራውን ፈጣን እና ይበልጥ ጥራት ያለው እንዲሆን እያገዘው ይገኛል።

1. **ፈጣን የዲዛይን ፍተሻ:** የAI ሲስተሞች የፋይል ችግሮችን በሰከንዶች ውስጥ በመለየት ለህትመት ዝግጁ ያደርጋሉ።
2. **ትክክለኛ የቀለም ቁጥጥር:** ማሽኖች የወረቀቱን ባህሪ እና የአየሩን ሁኔታ በማስላት ከመጀመሪያው እስከ መጨረሻው ቅጽ ድረስ አንድ ወጥ የቀለም ጥራት እንዲኖር ያስችላሉ።
      `,
      om: `
### Qindoomina AI fi Maxxansaa

Bara 2026tti AI dizaayinii fi maxxansa bal'aa keessatti saffisaa fi qulqullina olaanaa fiduuf gargaaraa jira.
      `,
    },
    author: "Kibreab Wolde",
    authorRole: "Technical Director at GT Printing",
    publishedDate: "October 20, 2026",
    readTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Artificial Intelligence", "Innovation", "Workflow", "Prepress"],
  },
];
