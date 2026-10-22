import { Locale } from "@/types/database";

export interface MachineSpec {
  name: string;
  category: "offset" | "cutting" | "binding" | "finishing" | "signage";
  manufacturer: string;
  origin: string;
  keySpecs: string[];
  description: Record<Locale, string>;
  image: string;
}

export const MACHINERY_DATA: MachineSpec[] = [
  {
    name: "Heidelberg Speedmaster SM 74",
    category: "offset",
    manufacturer: "Heidelberg Druckmaschinen AG",
    origin: "Germany",
    keySpecs: [
      "Speed: Up to 15,000 sheets/hour",
      "Max Sheet Size: 530 x 740 mm",
      "CP2000 Digital Touchscreen Control",
      "Inline aqueous coating unit",
    ],
    description: {
      en: "The global benchmark in high-speed commercial offset printing. Provides razor-sharp dot fidelity, rapid make-ready times, and flawless solids across high-volume publications and collateral.",
      am: "የዓለማችን ቀዳሚ የኦፍሴት ማተሚያ ማሽን። በሰዓት እስከ 15,000 ቅጾችን በማተም እንከን የለሽ ጥራት እና የቀለም ውህደት ይሰጣል።",
      om: "Sadarkaa addunyaatti maashina maxxansa ofseetii beekamaa. Sa'aatii tokkotti waraqaa 15,000 qulqullina olaanaan maxxansa.",
    },
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Komori Lithrone G40",
    category: "offset",
    manufacturer: "Komori Corporation",
    origin: "Japan",
    keySpecs: [
      "Speed: 16,500 sheets/hour",
      "Max Sheet Size: 720 x 1030 mm (B1)",
      "KHS-AI Smart Sequence automation",
      "High-precision spectrophotometric color control",
    ],
    description: {
      en: "Engineered for heavyweight packaging cartons and color-critical publications with high productivity and minimal waste.",
      am: "ለከፍተኛ መጠን የፓኬጂንግ ካርቶኖች እና የቀለም ጥራታቸው ወሳኝ ለሆኑ ህትመቶች የተሰራ ጃፓናዊ ማሽን።",
      om: "Kaartoonii paakeejingii gurguddoo fi maxxansa halluu barbaadaniif kan oole.",
    },
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Polar Mohr 115 High-Speed Guillotine",
    category: "cutting",
    manufacturer: "Polar-Mohr Maschinenvertriebsgesellschaft",
    origin: "Germany",
    keySpecs: [
      "Cutting Width: 1,150 mm",
      "OptiKnife micro-precision blade stroke",
      "Programmable touch interface with 1,998 memory spots",
      "High-pressure hydraulic clamping system",
    ],
    description: {
      en: "Delivers razor-sharp 0.1mm trimming accuracy for edge-to-edge bleed publications, corporate stationery, and folding carton blanks.",
      am: "የ0.1 ሚሊሜትር ትክክለኛነት ያለው ጀርመናዊ የቆረጣ ማሽን። ፍጹም የሆነ የዳር እና የይዘት መቆራረጥን ያረጋግጣል።",
      om: "Qulqullina kutaa 0.1 mm kan qabu maashina kutaa ammayyaa.",
    },
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Müller Martini Perfect Binder & Trimmer",
    category: "binding",
    manufacturer: "Müller Martini AG",
    origin: "Switzerland",
    keySpecs: [
      "Speed: 2,500 books/hour",
      "Spine Thickness: 2 mm to 60 mm",
      "High-strength PUR & EVA hotmelt spine glue",
      "Automated inline three-knife trimmer",
    ],
    description: {
      en: "Automated inline softcover book binding station providing durable square backs and superior pull-strength resistance.",
      am: "በሰዓት እስከ 2,500 መጽሐፍትን በከፍተኛ ጥንካሬ እና ውበት የሚጠርዝ የስዊዘርላንድ ጥረዛ ማሽን።",
      om: "Sa'aatii tokkotti kitaabota 2,500 qabsiisa cimaan kan qopheessu.",
    },
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Autobond High-Speed Thermal Laminator",
    category: "finishing",
    manufacturer: "Autobond Ltd",
    origin: "United Kingdom",
    keySpecs: [
      "Operating Speed: 60 meters/minute",
      "Thermal chrome heated cylinder up to 140°C",
      "Substrates: 90gsm to 650gsm card",
      "Finishes: Matte, Gloss, Soft-Touch & Anti-Scratch",
    ],
    description: {
      en: "Applies silky soft-touch and scuff-free gloss protective films to prestige packaging, catalogs, and menu cards.",
      am: "የላቀ የልስላሴ እና የጥንካሬ ሽፋን የሚሰጥ የብሪታንያ የላሚኔሽን ማሽን።",
      om: "Maashina laamineeshinii uffisa qulqulluu fi bareedaa kennu.",
    },
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Heavy-Duty 3m x 2m Industrial CNC Router",
    category: "signage",
    manufacturer: "GT Industrial Engineering",
    origin: "In-House Workshop",
    keySpecs: [
      "Bed Size: 3,050 x 2,050 mm",
      "9kW High-Torque HSD Spindle (24,000 RPM)",
      "Vacuum zoning bed with mist coolant",
      "Materials: Acrylic, Alucobond, Wood, Forex, Brass",
    ],
    description: {
      en: "Carves 3D architectural letters, acrylic lightbox panels, and structural signage frames with 0.05mm robotic accuracy.",
      am: "የ3D ፊደላትን፣ የአክሬሊክ እና የአልኮቦንድ ቅርጾችን በከፍተኛ የሮቦቲክ ትክክለኛነት የሚቀርጽ የፋብሪካችን ሲኤንሲ ማሽን።",
      om: "Qubeelee 3D, akiriilikii fi sibiila salphaa kan boca ammayyaan qaru.",
    },
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Industrial Large-Bed UV Flatbed Printer",
    category: "signage",
    manufacturer: "Industrial Graphics Corp",
    origin: "Japan / Germany",
    keySpecs: [
      "Print Area: 2,500 x 1,300 mm",
      "Variable Drop Ricoh Gen6 Printheads",
      "Dual LED-UV Instant Curing Lamps",
      "Colors: CMYK + White + Clear Spot Gloss",
    ],
    description: {
      en: "Prints directly onto rigid acrylic, wood, glass, aluminum, and forex boards with zero VOCs and instant scratch-proof curing.",
      am: "በቀጥታ በአክሬሊክ፣ በእንጨት፣ በመስታወት እና በቦርዶች ላይ በአስተማማኝ ሁኔታ የሚያትም የዩቪ ፍላትቤድ ማሽን።",
      om: "Akiriilikii, mukaa fi sibiila irratti kallattiin kan maxxansu.",
    },
    image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=800&q=80",
  },
];

export const WORKFLOW_STAGES = [
  {
    stage: "01",
    name: {
      en: "Design & Pre-Flight Audit",
      am: "ዲዛይን እና የፋይል ፍተሻ",
      om: "Dizaayinii fi Qorannoo Faayilaa",
    },
    desc: {
      en: "Color gamut conversion, bleed validation, and high-resolution plate generation.",
      am: "የቀለም ትክክለኛነት፣ የብሊድ ልኬት እና የፕሌት ዝግጅት።",
      om: "Sirreeffama halluu fi qophii pilaatarii.",
    },
    checkpoint: "ISO 12647-2 Digital Check",
  },
  {
    stage: "02",
    name: {
      en: "Proofing & Hard Validation",
      am: "ናሙና እና አካላዊ ማረጋገጫ",
      om: "Fakkeenya fi Mirkaneessa Qabatamaa",
    },
    desc: {
      en: "Digital soft-proofing plus mandatory calibrated hard proofs for color-critical work.",
      am: "ዲጂታል ናሙና እና ቀለሙን ለማረጋገጥ የሚደረግ ትክክለኛ አካላዊ ናሙና ፍተሻ።",
      om: "Maxxansaan dura mirkaneessa dijitaalaa fi qabatamaa.",
    },
    checkpoint: "Physical Client Sign-Off",
  },
  {
    stage: "03",
    name: {
      en: "In-House Press Production",
      am: "የውስጥ ማተሚያ ቤት ምርት",
      om: "Oomisha Maxxansaa Keessaa",
    },
    desc: {
      en: "Offset, UV flatbed, or digital press run with continuous densitometer monitoring.",
      am: "በኦፍሴት ወይም በዩቪ ማሽነሪዎች አማካኝነት የቀለም ጥራቱን ጠብቆ የሚከናወን ህትመት።",
      om: "Oomisha maxxansaa to'annoo qulqullinaa wajjin.",
    },
    checkpoint: "Spectrophotometer Color Match",
  },
  {
    stage: "04",
    name: {
      en: "Structural Fabrication & Finishing",
      am: "ቅርጻ፣ ጥረዛ እና ማጠናቀቂያ",
      om: "Qabsiisa, Boca fi Xumura",
    },
    desc: {
      en: "Automated folding, PUR binding, die-cutting, CNC carving, and electrical LED wiring.",
      am: "መቁረጥ፣ መታጠፍ፣ ጥረዛ፣ የሲኤንሲ ቅርጻ እና የLED መብራት ገመድ ዝርጋታ።",
      om: "Kutaa, qabsiisa, boca CNC fi ifa LED hojjechuu.",
    },
    checkpoint: "Mechanical Tolerance & Pull Test",
  },
  {
    stage: "05",
    name: {
      en: "Quality Packaging & Installation",
      am: "ጥራት ማረጋገጥ እና ተከላ",
      om: "Qulqullina Mirkaneessuu fi Dhaabbii",
    },
    desc: {
      en: "Multi-point QA inspection, protective bubble wrapping, and turnkey site installation.",
      am: "የመጨረሻ ፍተሻ፣ በጥንቃቄ ማሸግ እና በቦታው ሄዶ የመግጠም ስራ።",
      om: "Qorannoo xumuraa, saanduqaan guduunfuu fi bakka sanatti dhaabuu.",
    },
    checkpoint: "Final Client Delivery / Site Handover",
  },
];
