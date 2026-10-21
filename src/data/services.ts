import { Locale } from "@/types/database";

export interface ServiceDetail {
  slug: string;
  glyph:
    | "offset-roller"
    | "uv-flatbed"
    | "laser-beam"
    | "cnc-router"
    | "guillotine-blade"
    | "foil-emboss"
    | "thermal-laminate"
    | "saddle-stitch";
  title: Record<Locale, string>;
  shortDesc: Record<Locale, string>;
  fullDesc: Record<Locale, string>;
  typicalProducts: Record<Locale, string[]>;
  finishesAndMaterials: Record<Locale, string[]>;
  equipmentUsed: string[];
  turnaroundTime: Record<Locale, string>;
  coverImage: string;
  galleryImages: string[];
}

export const SERVICES_DATA: ServiceDetail[] = [
  {
    slug: "offset-digital-printing",
    glyph: "offset-roller",
    title: {
      en: "Offset & Digital Printing",
      am: "ኦፍሴት እና ዲጂታል ህትመት",
      om: "Maxxansa Ofseetii fi Dijitaalaa",
    },
    shortDesc: {
      en: "High-volume commercial offset and ultra-fast digital printing with color-critical precision.",
      am: "ከፍተኛ መጠን ያለው የንግድ ኦፍሴት እና ፈጣን ዲጂታል ህትመት በትክክለኛ የቀለም ጥራት።",
      om: "Maxxansa ofseetii daldalaa baay'ina olaanaa fi maxxansa dijitaalaa saffisaa halluu qulqulluun.",
    },
    fullDesc: {
      en: "Our printing plant pairs multi-unit Heidelberg Speedmaster and Komori Lithrone presses with next-generation digital production engines. Whether you require 200 bespoke business cards or 500,000 corporate flyers, we guarantee zero banding, crisp micro-typography, and spectrophotometer-calibrated color fidelity.",
      am: "የማተሚያ ፋብሪካችን የሃይድልበርግ ስፒድማስተር እና የኮሞሪ ሊትሮን ማሽኖችን ከዘመናዊ ዲጂታል ማተሚያዎች ጋር አቀናጅቶ ይዟል። 200 የንግድ ካርዶችም ሆኑ 500,000 የኮርፖሬት ፍላየሮች ቢፈልጉ የቀለም ጥራቱን ጠብቀን በከፍተኛ ፍጥነት እናቀርባለን።",
      om: "Warshaan maxxansaa keenya maashinoota Heidelberg Speedmaster fi Komori Lithrone teeknooloojii dijitaalaa ammayyaa wajjin qindeessuun hojjeta. Kaardii daldalaa 200 irraa kaasee hanga fulaayarii 500,000tti qulqullina olaanaan dhiyeessina.",
    },
    typicalProducts: {
      en: ["Business cards", "Corporate brochures", "Flyers & folded leaflets", "Presentation folders", "Diplomas & certificates", "Restaurant menus", "Takeaway sleeves"],
      am: ["የንግድ ካርዶች", "የድርጅት ብሮሸሮች", "ፍላየሮች እና በራሪ ወረቀቶች", "የሰነድ ፎልደሮች", "ዲፕሎማዎች እና የምስክር ወረቀቶች", "የምግብ ዝርዝር (ሜኑ)", "የመጠጥ እና ምግብ ማሸጊያዎች"],
      om: ["Kaardii daldalaa", "Biroosharoota dhaabbataa", "Fulaayarii fi waraqaa beeksisaa", "Foolderii sanadaa", "Sartafikeetii fi dippiloomaa", "Meenuu nyaataa", "Saanduqa nyaata fudhatamaa"],
    },
    finishesAndMaterials: {
      en: ["80gsm to 400gsm Art Paper & Card", "Kraft paper & textured stocks", "Soft-touch matte & gloss lamination", "Spot UV varnish", "Metallic foil stamping (Gold/Silver/Ruby)", "Precision kiss-cut & die-cut"],
      am: ["ከ80 እስከ 400 ግራም የአርት ወረቀት እና ካርድ", "ክራፍት እና ቴክስቸርድ ወረቀቶች", "ማት እና ግሎስ ላሚኔሽን", "ስፖት ዩቪ ቫርኒሽ", "የወርቅ እና የብር ፎይል ህትመት", "ቅርጽ ማውጫ ዳይ-ከት"],
      om: ["Waraqaa fi kaardii 80 hanga 400 gsm", "Waraqaa giraaftii fi halluu qabu", "Laamineeshinii luuccaa fi calaqqisaa", "Ispootti UV", "Maxxansa fooyilii warqee fi meetii", "Kutaa fi boca addaa (Die-cut)"],
    },
    equipmentUsed: ["Heidelberg Speedmaster SM 74", "Komori Lithrone G40", "High-speed Digital Color Press"],
    turnaroundTime: {
      en: "Same-Day for digital runs; 2–4 working days for volume offset.",
      am: "ለዲጂታል ህትመት በተመሳሳይ ቀን፤ ለከፍተኛ ኦፍሴት ከ2–4 የስራ ቀናት።",
      om: "Dijitaalaaf guyyuma sana; ofseetii bal'aaf guyyoota hojii 2–4.",
    },
    coverImage: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    slug: "publishing-binding",
    glyph: "saddle-stitch",
    title: {
      en: "Publishing & Binding",
      am: "ህትመት እና የመጽሐፍት ጥረዛ",
      om: "Maxxansa fi Qabsiisa Kitaabaa",
    },
    shortDesc: {
      en: "Turnkey publication printing: magazines, annual reports, corporate profiles, and academic textbooks.",
      am: "የመጽሔቶች፣ አመታዊ ሪፖርቶች፣ የድርጅት ፕሮፋይሎች እና የመማሪያ መጽሐፍት የተሟላ ህትመት እና ጥረዛ።",
      om: "Maxxansa fi qabsiisa barruulee, gabaasa waggaa, piroofaayila dhaabbilee fi kitaabota barumsaa.",
    },
    fullDesc: {
      en: "We engineer long-lasting publications built to withstand heavy handling. Using automated inline Horizon folding units, Müller Martini perfect binders, and Duplo bookletmakers, we provide clean square spines, robust PUR glue adhesion, and lay-flat page spreads.",
      am: "ለረጅም ጊዜ የሚቆዩ እና ጥራታቸው የተጠበቀ መጽሐፍትን እናዘጋጃለን። በሆራይዘን እና በሙለር ማርቲኒ የጥረዛ ማሽኖች አማካኝነት ጠንካራ እና ውብ የመጽሐፍ ጥረዛዎችን እናቀርባለን።",
      om: "Barruulee fi kitaabota yeroo dheeraa turan qulqullinaan maxxansina. Meeshaalee Horizon fi Müller Martini gargaaramuun qabsiisa cimaa fi bareedaa dhiyeessina.",
    },
    typicalProducts: {
      en: ["Annual corporate reports", "NGO & diplomatic publications", "Magazines & trade journals", "Company profiles", "School textbooks & workbooks", "Product catalogs", "Newsletters & bulletins"],
      am: ["አመታዊ የድርጅት ሪፖርቶች", "የመንግስታዊ ያልሆኑ ድርጅቶች ሰነዶች", "መጽሔቶች", "የድርጅት መገለጫዎች (ፕሮፋይል)", "የትምህርት መጽሐፍት", "የምርት ካታሎጎች", "ጋዜጣዎች እና ጋዜጣዊ መግለጫዎች"],
      om: ["Gabaasa waggaa dhaabbilee", "Barruulee NGO fi imbaasiiwwanii", "Barruulee yeroo", "Piroofaayila dhaabbataa", "Kitaabota barnootaa", "Kaataaloogii oomishaa", "Waraqaa oduu fi beeksisaa"],
    },
    finishesAndMaterials: {
      en: ["Perfect binding (PUR/Hotmelt)", "Saddle-stitching (wire staples)", "Hardcover case-binding with ribbon bookmark", "Section sewn book blocks", "Embossed/Debossed leatherette covers", "Foil stamped spine lettering"],
      am: ["ፐርፌክት ባይንዲንግ (በሙቅ ሙጫ ጥረዛ)", "የሽቦ እስቴፕል ጥረዛ", "ጠንካራ የካርቶን ሽፋን ጥረዛ ከሪባን ጋር", "በስፌት የተጠናከረ ጥረዛ", "የተቀረጸ የቆዳ ሽፋን", "የወርቅ ፎይል ጽሁፍ"],
      om: ["Qabsiisa PUR/Hotmelt", "Qabsiisa waayeraa", "Qabsiisa gogaa cimaa riboonii qabu", "Hodhaa kutaatiin qabsiifame", "Qola gogaa bocame", "Barreeffama fooyilii warqee"],
    },
    equipmentUsed: ["Müller Martini Perfect Binder", "Horizon Folding Unit", "Duplo Bookletmaker", "Polar Mohr Guillotine"],
    turnaroundTime: {
      en: "Short-run booklets in 24–48 hours; high-volume editions in 3–7 working days.",
      am: "አነስተኛ ጥራዞች በ24–48 ሰዓታት፤ ከፍተኛ መጠን በ3–7 የስራ ቀናት።",
      om: "Qabsiisa muraasa sa'aatii 24–48 keessatti; baay'ina olaanaa guyyoota 3–7.",
    },
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    slug: "packaging-solutions",
    glyph: "foil-emboss",
    title: {
      en: "Packaging Solutions",
      am: "የፓኬጂንግ እና ሳጥን ስራዎች",
      om: "Saanduqa fi Paakeejingii",
    },
    shortDesc: {
      en: "Custom structural packaging boxes, rigid luxury cartons, labels, and food-grade packaging.",
      am: "የተለያዩ የምርት መያዣ ሳጥኖች፣ ጠንካራ የቅንጦት ካርቶኖች፣ ሌብሎች እና የምግብ ማሸጊያዎች።",
      om: "Saanduqa oomishaa addaa, kaartoonii qulqulluu, leebilii fi maashagiyaa nyaataa.",
    },
    fullDesc: {
      en: "We turn structural engineering into brand equity. With internal CAD cutting tables, heavy-duty platen die-cutters, and specialty foil applicators, we produce precision retail folding cartons, rigid presentation gift boxes, and self-locking e-commerce mailers that command retail shelf attention.",
      am: "ምርቶችዎን በገበያ ላይ ጎልተው እንዲታዩ የሚያደርጉ ማራኪ ሳጥኖችን እንሰራለን። በራሳችን የሲኤዲ እና የዳይ-ከት ማሽነሪዎች የመድሃኒት፣ የመዋቢያ፣ የቡና እና የኤሌክትሮኒክስ ሳጥኖችን በከፍተኛ ጥራት እናመርታለን።",
      om: "Oomishaalee keessan gabaa irratti akka mul'atan kan taasisan saanduqa bareedaa hojjenna. Meeshaalee CAD fi die-cut keenyaan saanduqa qorichaa, mi'a miidhaginaa, buna fi elektirooniksii qulqullinaan oomishna.",
    },
    typicalProducts: {
      en: ["Cosmetic & pharmaceutical folding boxes", "Rigid luxury gift boxes", "Specialty coffee & tea packaging", "Industrial shipping cartons", "Roll labels & self-adhesive stickers", "Custom branded paper carrier bags"],
      am: ["የመዋቢያ እና የመድሃኒት ሳጥኖች", "የስጦታ እና የቅንጦት ሳጥኖች", "የቡና እና የሻይ ማሸጊያዎች", "የኢንዱስትሪ ማጓጓዣ ካርቶኖች", "ሌብሎች እና ተለጣፊ እስቲከሮች", "በድርጅትዎ ስም የታተሙ የወረቀት ቦርሳዎች"],
      om: ["Saanduqa qorichaa fi meeshaa miidhaginaa", "Saanduqa kennaa gati jabeeyyii", "Waan bunaa fi shaayee", "Kaartoonii daldalaa fi fe'iinsaa", "Leebilii fi istikarii maxxanu", "Borseetti waraqaa maqaa dhaabbataatiin"],
    },
    finishesAndMaterials: {
      en: ["Duplex, Triplex & SBS White bleached board", "Rigid greyboard 1.5mm–3.0mm", "Food-grade certified barrier boards", "Holographic & tactile embossing", "Magnetic closure flaps & ribbon pulls", "Window patching with clear acetate"],
      am: ["ዱፕሌክስ፣ ትሪፕሌክስ እና ኤስቢኤስ ቦርድ", "ጠንካራ ግሬይቦርድ ከ1.5 እስከ 3.0 ሚሜ", "ለምግብነት የተረጋገጡ ማሸጊያ ወረቀቶች", "ሆሎግራፊክ እና የታሸገ ቅርጽ ህትመት", "መግነጢሳዊ መክፈቻ ያላቸው ሳጥኖች", "ግልጽ መስኮት ያላቸው ሳጥኖች"],
      om: ["Waraqaa SBS fi duppileeksii", "Kaartoonii furdaa 1.5 hanga 3.0 mm", "Waraqaa nyaataaf hayyamame", "Maxxansa hologiraamii fi bocame", "Cufaa maagneetiitiin hojjetame", "Foddaa ifa qabu kan qabu"],
    },
    equipmentUsed: ["Automatic Platen Die-Cutter", "CAD Digital Sample Plotter", "Folder Gluer Line"],
    turnaroundTime: {
      en: "Prototyping in 24 hours; production runs in 5–10 working days.",
      am: "የናሙና ዝግጅት በ24 ሰዓት፤ ምርት ከ5–10 የስራ ቀናት።",
      om: "Qophii fakkeenyaa sa'aatii 24 keessatti; oomisha guyyoota 5–10.",
    },
    coverImage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    slug: "large-format-signage",
    glyph: "uv-flatbed",
    title: {
      en: "Large Format & Signage",
      am: "ትልልቅ ህትመቶች እና ሳይኔጅ",
      om: "Maxxansa Bal'aa fi Mallattoo",
    },
    shortDesc: {
      en: "3D illuminated architectural storefronts, UV flatbed printing, acrylic channel letters, and billboard media.",
      am: "3D መብራት ያላቸው የህንጻ ሳይኔጆች፣ የዩቪ ፍላትቤድ ህትመት፣ የአክሬሊክ ቅርጻ ፊደላት እና ትልልቅ የማስታወቂያ ቦርዶች።",
      om: "Mallattoolee gamoo 3D ifa qaban, maxxansa UV, qubeelee akiriilikii fi gabatee beeksisaa gurguddoo.",
    },
    fullDesc: {
      en: "GT Printing brings architectural signage under the same roof as paper printing. Inside our dedicated fabrication workshop behind Dembel, heavy CNC routers, UV flatbed printers, and fiber laser cutters produce illuminated channel letters, edge-lit lightboxes, durable outdoor pylons, and exhibition stands.",
      am: "ጂቲ ማተሚያ ቤት የህንጻ ሳይኔጅ ስራዎችን ከወረቀት ህትመት ጋር በአንድ ላይ ያቀርባል። ከደንበል ጀርባ በሚገኘው የፋብሪካ ማዕከላችን በሲኤንሲ፣ በዩቪ ፍላትቤድ እና በሌዘር መቁረጫ ማሽኖች የ3D ፊደላት ሳይኔጆችን፣ የብርሃን ቦርዶችን እና የኤግዚቢሽን ስታንዶችን እናመርታለን።",
      om: "Maxxansi GT mallattoolee gamoo fi maxxansa waraqaa bakka tokkotti dhiyeessa. Warshaa keenya duuba Dembel jiru keessatti maashinoota CNC, UV fi leezariin qubeelee 3D, gabatee ifaa fi bakka agarsiisaa qulqullinaan hojjenna.",
    },
    typicalProducts: {
      en: ["3D LED-backlit channel letter storefront signage", "Outdoor advertising billboards & unipoles", "Roll-up banners & X-banner stands", "Vehicle branding & fleet decals", "Direct-to-board UV prints (Forex, Acrylic, Alucobond)", "Directional wayfinding sign systems"],
      am: ["በLED መብራት የሚያበሩ የ3D ፊደል ሳይኔጆች", "ትልልቅ የውጭ ማስታወቂያ ቢልቦርዶች", "የሮል-አፕ እና የኤክስ-ባነር ስታንዶች", "የመኪና እና የተሸከርካሪ ማስታወቂያ ህትመቶች", "በቀጥታ በፎሬክስ፣ አክሬሊክ እና አልኮቦንድ ላይ የሚደረግ የዩቪ ህትመት", "የአቅጣጫ ጠቋሚ የውስጥ እና የውጭ ሳይኔጆች"],
      om: ["Mallattoo 3D LED ifa qabu kan fuula gamoo", "Gabatee beeksisaa ala gurguddoo", "Istaandii rool-appi fi X-baanerii", "Maxxansa beeksisa konkolaataa", "Maxxansa UV kallattiin fooreeksii fi akiriilikii irratti", "Mallattoolee kallattii agarsiisan"],
    },
    finishesAndMaterials: {
      en: ["Aluminum composite panels (Alucobond)", "Cast acrylic (Plexiglass) 3mm–20mm", "High-density PVC Forex board", "High-efficiency Samsung LED modules (IP67)", "Automotive polyurethane paint finishes", "Reflective 3M engineering vinyl films"],
      am: ["አሉሚኒየም ኮምፖዚት ፓነል (አልኮቦንድ)", "አክሬሊክ (ፕሌክሲግላስ) ከ3 እስከ 20 ሚሜ", "ከፍተኛ ጥንካሬ ያለው ፎሬክስ ቦርድ", "የሳምሰንግ LED መብራቶች (IP67)", "የመኪና ቀለም ቅብ", "የ3M አንጸባራቂ ቪናይል ፊልም"],
      om: ["Paanaalii alumiiniyeemii (Alucobond)", "Akiriilikii furdaa 3mm hanga 20mm", "Boordii fooreeksii PVC cimaa", "Iftoota Samsung LED (IP67)", "Halluu konkolaataa ammayyaa", "Waraqaa calaqqisaa 3M"],
    },
    equipmentUsed: ["High-Precision CNC Router (3m x 2m bed)", "Industrial UV Flatbed Printer", "Fiber Laser Metal & Acrylic Cutter"],
    turnaroundTime: {
      en: "Roll-up banners in 4 hours; 3D architectural signage in 5–10 working days.",
      am: "ሮል-አፕ ባነር በ4 ሰዓታት፤ የ3D ህንጻ ሳይኔጅ ከ5–10 የስራ ቀናት።",
      om: "Baanera rool-appii sa'aatii 4 keessatti; mallattoo 3D guyyoota 5–10.",
    },
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    slug: "graphic-design-prepress",
    glyph: "laser-beam",
    title: {
      en: "Graphic Design & Pre-Press",
      am: "ግራፊክ ዲዛይን እና ቅድመ-ህትመት",
      om: "Giraafik Dizaayinii fi Qophii",
    },
    shortDesc: {
      en: "Brand guidelines, CTP plate-making, color calibration, and pre-flight artwork auditing.",
      am: "የብራንድ መመሪያዎች፣ የሲቲፒ ፕሌት ዝግጅት፣ የቀለም ማስተካከያ እና የቅድመ-ህትመት ፋይል ፍተሻ።",
      om: "Qajeelfama mallattoo, qophii pilaatarii CTP, sirreeffama halluu fi mirkaneessa faayilaa.",
    },
    fullDesc: {
      en: "A print run is only as good as its pre-press preparation. Our senior graphic designers and pre-press technicians scrutinize incoming artwork for bleed compliance, overprint traps, CMYK color gamut translation, font outline integrity, and image DPI to prevent costly press downtime and print flaws.",
      am: "ጥራት ያለው ህትመት የሚጀምረው ከተስተካከለ ቅድመ-ህትመት ዝግጅት ነው። ባለሙያዎቻችን የዲዛይን ፋይሎችዎን የቀለም አይነት፣ የብሊድ መጠን፣ የፊደላት ጥራት እና የፎቶ ጥራት ፈትሸው ለህትመት ዝግጁ ያደርጋሉ።",
      om: "Maxxansi qulqullina qabu qophii maxxansaan duraa irraa jalqaba. Ogeeyyiin keenya halluu, gosa barreeffamaa fi qulqullina suuraa faayila keessanii sirreessuun qopheessu.",
    },
    typicalProducts: {
      en: ["Corporate visual identity systems", "Typesetting & layout formatting", "Pre-flight file diagnostic & error repair", "Computer-to-Plate (CTP) thermal plate output", "Physical calibrated hard-copy contract proofs", "Structural dieline CAD engineering"],
      am: ["የድርጅት መለያ ዲዛይን", "የመጽሐፍት እና መጽሔት ገጽ አቀማመጥ", "የህትመት ፋይል ፍተሻ እና ማስተካከያ", "የሲቲፒ ፕሌት ማውጣት", "ትክክለኛ አካላዊ ናሙና ማረጋገጫ", "የሳጥን እና ማሸጊያ መቁረጫ መስመር ዝግጅት"],
      om: ["Dizaayinii eenyummeessa dhaabbataa", "Qindaa'ina fuula kitaabaa", "Qorannoo fi sirreeffama faayilii", "Baafata pilaatarii CTP", "Fakkeenya qabatamaa halluu mirkaneessu", "Qophii sarara kutaatiin qophaa'u"],
    },
    finishesAndMaterials: {
      en: ["ISO 12647-2 color standard compliance", "Thermal CTP plates up to 1030mm x 790mm", "FOGRA certified digital contract proofing", "Vector dieline rendering in PDF/X-1a and PDF/X-4"],
      am: ["የአይኤስኦ 12647-2 የቀለም ደረጃ", "ተርማል ሲቲፒ ፕሌት እስከ 1030x790 ሚሜ", "ትክክለኛ ዲጂታል ናሙና ማረጋገጫ", "የተስተካከለ የህትመት ቬክተር ፋይል"],
      om: ["Sadarkaa halluu ISO 12647-2", "Pilaatarii CTP hanga 1030x790 mm", "Fakkeenya mirkanaa'e dijitaalaa", "Faayilii veektaraa maxxansaaf ta'u"],
    },
    equipmentUsed: ["Screen PlateRite Thermal CTP", "Epson Stylus Pro SpectroProof Color Proofer", "Adobe CC & Esko PackEdge Prepress Suite"],
    turnaroundTime: {
      en: "Pre-press file audit within 2–4 hours; CTP plate delivery same day.",
      am: "የፋይል ፍተሻ በ2–4 ሰዓታት፤ ፕሌት ማውጣት በተመሳሳይ ቀን።",
      om: "Qorannoon faayilii sa'aatii 2–4 keessatti; pilaatariin guyyuma sana.",
    },
    coverImage: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    slug: "corporate-promotional-items",
    glyph: "cnc-router",
    title: {
      en: "Corporate & Promotional Items",
      am: "የድርጅት መለያ እና ማስታወቂያ እቃዎች",
      om: "Meeshaalee Beeksisa Dhaabbataa",
    },
    shortDesc: {
      en: "Executive corporate gifts, branded stationery sets, custom diaries, textiles, and event packages.",
      am: "የድርጅት ስጦታዎች፣ የታተሙ የጽህፈት መሳሪያዎች፣ አጀንዳዎች፣ ቲሸርቶች እና የዝግጅት መለያ እቃዎች።",
      om: "Kennaa dhaabbilee, meeshaalee waraqaa maqaa qaban, ajandaa, tishartii fi meeshaalee beeksisaa.",
    },
    fullDesc: {
      en: "Strengthen relationships and build institutional memorability with high-touch executive branding. From customized leather-bound executive organizers and laser-engraved metal pens to screen-printed event textiles, we ensure your visual identity is flawlessly represented across all touchpoints.",
      am: "የድርጅትዎን ገጽታ የሚያጎሉ ልዩ የስጦታ እና የማስታወቂያ እቃዎችን እናዘጋጃለን። በቆዳ የተሸፈኑ አጀንዳዎች፣ በሌዘር የተጻፈባቸው እስክሪብቶዎች፣ የታተሙ ቲሸርቶች እና ኮፍያዎችን በከፍተኛ ጥራት እናቀርባለን።",
      om: "Eenyummeessa dhaabbata keessanii kan beeksisan meeshaalee kennaa addaa qopheessina. Ajandaa gogaa, qalama leezariin barreeffame, tishartii fi kofiyyaa qulqullinaan dhiyeessina.",
    },
    typicalProducts: {
      en: ["Custom leatherette executive diaries & planners", "Laser-engraved executive pens & desk accessories", "Screen-printed & embroidered corporate t-shirts & polo shirts", "Branded ceramic mugs & vacuum insulated thermal flasks", "Custom lanyards & PVC ID cards with RFID chips", "Branded flash drives & power banks"],
      am: ["የተዘጋጁ የቆዳ አጀንዳዎች እና ማስታወሻዎች", "በሌዘር የተቀረጹ የብረት እስክሪብቶዎች", "የድርጅት መለያ ቲሸርቶች እና ፖሎዎች", "የታተሙ ሰኒዎች እና የፍላስክ እቃዎች", "የአንገት ሪባኖች እና የድርጅት ባጆች", "የታተመባቸው ፍላሽ ድራይቮች እና ፓወር ባንኮች"],
      om: ["Ajandaa fi yaadannoo gogaan uffifame", "Qalama sibiilaa leezariin barreeffame", "Tishartii fi kofiyyaa mallattoo qabu", "Sanii fi fulaaskii maqaa qabu", "Riboonii mormaafi kaardii eenyummeessaa", "Filaashii fi paawar baankii maqaa qabu"],
    },
    finishesAndMaterials: {
      en: ["Rotary UV bottle and cylinder printing", "Direct-to-Film (DTF) & screen print textile transfer", "Fiber laser annealing on stainless steel & brass", "Debossed leather branding with gold foil highlights"],
      am: ["በጠርሙስ እና በኩባያ ላይ የሚደረግ የዩቪ ህትመት", "በጨርቅ ላይ የሚደረግ የዲቲኤፍ እና የሐር ህትመት", "በብረት ላይ የሚደረግ የሌዘር ቅርጻ", "በቆዳ ላይ የሚደረግ የታሸገ የወርቅ ፎይል ህትመት"],
      om: ["Maxxansa UV qaruuraa fi kubbaayyaa irratti", "Maxxansa DTF uffata irratti", "Boca leezarii sibiila irratti", "Maxxansa fooyilii warqee gogaa irratti"],
    },
    equipmentUsed: ["Rotary UV Cylindrical Printer", "Fiber Laser Engraver", "Automatic Textile Screen Carousel"],
    turnaroundTime: {
      en: "Laser engraving in 24–48 hours; custom textile and gift sets in 4–7 working days.",
      am: "የሌዘር ቅርጻ በ24–48 ሰዓት፤ የስጦታ እቃዎች ከ4–7 የስራ ቀናት።",
      om: "Boca leezarii sa'aatii 24–48 keessatti; meeshaan kennaa guyyoota 4–7.",
    },
    coverImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    ],
  },
];
