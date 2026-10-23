import { Locale } from "@/types/database";

export interface IndustryData {
  slug: string;
  icon: string;
  image?: string;
  galleryUrls?: string[];
  order: number;
  active: boolean;
  translations: Record<
    Locale,
    {
      title: string;
      subtitle: string;
      description: string;
      products: string[];
    }
  >;
}

export const INDUSTRIES_DATA: IndustryData[] = [
  {
    slug: "banking-finance",
    icon: "Landmark",
    image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1200&q=80",
    order: 1,
    active: true,
    translations: {
      en: {
        title: "Banking & Financial Institutions",
        subtitle: "Awash Bank, Oromia Bank, Commercial Cooperatives",
        description:
          "High-security corporate printing, anti-counterfeit certificates, recurring annual reports, and standardized multi-branch 3D illuminated architectural signage.",
        products: [
          "Annual reports & financial statements",
          "3D illuminated branch storefront letters",
          "Anti-copy tamper-evident forms",
          "Executive desk accessories & diaries",
        ],
      },
      am: {
        title: "ባንኮች እና የፋይናንስ ተቋማት",
        subtitle: "አዋሽ ባንክ፣ ኦሮሚያ ባንክ፣ ህብረት ስራ ማህበራት",
        description:
          "ከፍተኛ የደህንነት ጥበቃ ያለባቸው ሰነዶች፣ ፀረ-ፎርጅድ ምስክር ወረቀቶች፣ አመታዊ ሪፖርቶች እና ባለ 3D አርክቴክቸራል የቅርንጫፍ ምልክቶች (Signage)።",
        products: [
          "አመታዊ ሪፖርቶች እና የፋይናንስ መግለጫዎች",
          "ባለ 3D የበራ የቅርንጫፍ መለያ ፊደላት",
          "ፀረ-ኮፒ የደህንነት ፎርሞች እና ቫውቸሮች",
          "የአስፈፃሚዎች የጠረጴዛ አጀንዳዎች እና ማስታወሻዎች",
        ],
      },
      om: {
        title: "Baankota fi Dhaabbilee Faayinaansii",
        subtitle: "Baankii Hawaash, Baankii Oromiyaa, Waldaalee Hojii Gamtaa",
        description:
          "Maxxansa nageenya olaanaa qabu, waraqaa ragaa sobaa ittisu, gabaasa waggaa fi mallattoolee damee 3D ifan.",
        products: [
          "Gabaasaalee waggaa fi herregaa",
          "Mallattoolee damee 3D ifan",
          "Uunkaalee nageenyaa garagalcha ittisan",
          "Daa'arii fi meeshaalee minjaalaa",
        ],
      },
    },
  },
  {
    slug: "education",
    icon: "GraduationCap",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    order: 2,
    active: true,
    translations: {
      en: {
        title: "Schools, Universities & Educational Institutions",
        subtitle: "National curriculum publishers, private academies, universities",
        description:
          "High-throughput textbook printing, serialized final examinations, security diplomas with holographic foil validation, and durable wire-stitched workbooks.",
        products: [
          "Student textbooks & exercise books",
          "Graduation diplomas & security certificates",
          "School catalogs & prospectuses",
          "ID cards & academic yearbooks",
        ],
      },
      am: {
        title: "ትምህርት ቤቶች፣ ዩኒቨርሲቲዎች እና አካዳሚዎች",
        subtitle: "የስርዓተ-ትምህርት አሳታሚዎች፣ የግል ትምህርት ቤቶች እና ዩኒቨርሲቲዎች",
        description:
          "በከፍተኛ ፍጥነት የመማሪያ መጽሐፍት ህትመት፣ ሚስጥራዊ የፈተና ወረቀቶች፣ ሆሎግራም ፎይል ያላቸው ዲፕሎማዎች እና ጠንካራ የተማሪዎች ደብተሮች።",
        products: [
          "የተማሪዎች መማሪያ መጽሐፍት እና ደብተሮች",
          "የምርቃት ዲፕሎማዎች እና የደህንነት ሰርተፊኬቶች",
          "የትምህርት ቤት ካታሎጎች እና ፕሮስፔክተሶች",
          "የተማሪ መታወቂያ እና የመመረቂያ መጽሔት",
        ],
      },
      om: {
        title: "Manneen Barumsaa fi Yuunivarsiitiiwwan",
        subtitle: "Maxxansitoota sirna barnootaa, koolleejjota fi yuunivarsiitiiwwan",
        description:
          "Maxxansa kitaabota barumsaa baay'ina guddaa, waraqaa qormaataa iccitii, dippiloomaa fi sartafikeetii nageenyaa.",
        products: [
          "Kitaabota barattootaa fi dabtara",
          "Dippiloomaa fi sartafikeetii eebbifamtootaa",
          "Kaataaloogii fi beeksisa mana barumsaa",
          "Kaardii eenyummaa fi barruulee eebbaa",
        ],
      },
    },
  },
  {
    slug: "healthcare",
    icon: "HeartPulse",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    order: 3,
    active: true,
    translations: {
      en: {
        title: "Medical & Healthcare Facilities",
        subtitle: "Hospitals, specialty clinics, pharmaceutical distributors",
        description:
          "Confidential diagnostic stationery, patient administrative folders, serialized prescription books, and certified folding cartons for medical supplies.",
        products: [
          "Numbered prescription pads",
          "Patient chart folders & medical records",
          "Pharmaceutical packaging folding cartons",
          "Clinical wayfinding & clinic signage",
        ],
      },
      am: {
        title: "የህክምና እና የጤና ተቋማት",
        subtitle: "ሆስፒታሎች፣ ስፔሻላይዝድ ክሊኒኮች፣ የመድሃኒት አከፋፋዮች",
        description:
          "ሚስጥራዊ የህክምና ቅጾች፣ የታካሚዎች የህክምና ካርድ ፎልደሮች፣ ተከታታይ ቁጥር ያላቸው የህክምና ማዘዣዎች እና የመድሃኒት ማሸጊያ ካርቶኖች።",
        products: [
          "ቁጥር ያላቸው የህክምና ማዘዣ (ፕሪስክሪፕሽን) ደብተሮች",
          "የታካሚ የካርድ ፎልደሮች እና የህክምና ሰነዶች",
          "የመድሃኒት ማሸጊያ ካርቶኖች (Folding Cartons)",
          "የክሊኒክ እና ሆስፒታል መመሪያ ምልክቶች",
        ],
      },
      om: {
        title: "Dhaabbilee Fayyaa fi Hospitaalota",
        subtitle: "Hospitaalota, kilinikoota fi qoricha raabsitoota",
        description:
          "Sanadoota yaalaa iccitii, foolderii yaalamtootaa, waraqaa qorichaa lakkoofsa qabu fi saanduqa qorichaa.",
        products: [
          "Waraqaa ajaja qorichaa lakkoofsoman",
          "Foolderii galmee yaalamtootaa",
          "Saanduqa qorichaa qulqullina qabu",
          "Mallattoolee kallattii agarsiisan",
        ],
      },
    },
  },
  {
    slug: "diplomatic-ngo",
    icon: "Globe2",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80",
    order: 4,
    active: true,
    translations: {
      en: {
        title: "Diplomatic Missions & International NGOs",
        subtitle: "UN agencies, foreign embassies, international humanitarian bodies",
        description:
          "Bilingual and trilingual research monographs, multi-color field manuals, conference backdrops, and executive humanitarian documentation suites.",
        products: [
          "Trilingual research monographs",
          "Durable conference roll-up banners",
          "Hard-cover casebound publications",
          "Custom event packaging kits",
        ],
      },
      am: {
        title: "ዲፕሎማሲያዊ ሚሲዮኖች እና አለምአቀፍ መንግስታዊ ያልሆኑ ድርጅቶች",
        subtitle: "የተመድ ኤጀንሲዎች፣ የውጭ ሀገራት ኤምባሲዎች፣ የግብረ-ሰናይ ድርጅቶች",
        description:
          "ባለ ሁለት እና ባለ ሶስት ቋንቋ የምርምር ፅሁፎች፣ የመስክ መመሪያዎች፣ የኮንፈረንስ ሮል-አፕ ባነሮች እና የክብር ሰነዶች።",
        products: [
          "በሶስት ቋንቋ የተዘጋጁ የምርምር ህትመቶች",
          "ለኮንፈረንስ የሚሆኑ ጠንካራ ሮል-አፕ ባነሮች",
          "በካርቶን ሽፋን የታሰሩ ጥራዞች (Hardcover)",
          "ልዩ የዝግጅት ማሸጊያ ኪቶች",
        ],
      },
      om: {
        title: "Ermisiiwwan fi Dhaabbilee Idil-Addunyaa",
        subtitle: "Dhaabbilee Dhaabbata Mootummoota Gamtoomanii fi ermisiiwwan",
        description:
          "Maxxansa qorannoo afaan sadiin qophaa'an, manuwaalii dirree, baanaarii konfiraansii fi sanadoota gurguddoo.",
        products: [
          "Barruulee qorannoo afaan sadiin qophaa'an",
          "Baanaarii konfiraansii rool-ap",
          "Qabsiisa qola jabaa qabu",
          "Saanduqa qophii addaa",
        ],
      },
    },
  },
  {
    slug: "corporate-branding",
    icon: "Building",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    order: 5,
    active: true,
    translations: {
      en: {
        title: "Corporate & Event Branding",
        subtitle: "Telecommunications, construction enterprises, tech firms",
        description:
          "High-impact retail promotional displays, vehicle fleet branding, premium presentation folders, and rapid regional marketing campaign materials.",
        products: [
          "3D channel letter facade signage",
          "Vehicle wrap graphics & decals",
          "Event exhibition booths & backdrops",
          "Promotional gift merchandise",
        ],
      },
      am: {
        title: "የኮርፖሬት እና የዝግጅት ብራንዲንግ",
        subtitle: "ቴሌኮሙኒኬሽን፣ የኮንስትራክሽን ድርጅቶች፣ የቴክኖሎጂ ኩባንያዎች",
        description:
          "ከፍተኛ ተፅእኖ የሚፈጥሩ የሱቅ ማስታወቂያዎች፣ የተሽከርካሪ ብራንዲንግ (Vehicle Branding)፣ የዝግጅት ቡቶች እና የስጦታ እቃዎች።",
        products: [
          "ባለ 3D የህንፃ ፊት ለፊት ፊደላት",
          "የመኪና እና የተሽከርካሪ ሙሉ ስቲከር ህትመት",
          "የኤግዚቢሽን እና የዝግጅት መድረክ ጀርባዎች (Backdrop)",
          "የድርጅት ማስታወቂያ ስጦታዎች",
        ],
      },
      om: {
        title: "Eenyummeessa Dhaabbataa fi Sagantaalee",
        subtitle: "Teeleekoom, dhaabbilee ijaarsaa fi teeknooloojii",
        description:
          "Beeksisa gabaa dhiibbaa uumu, beeksisa konkolaataa, foolderii dhiyeessaa fi meeshaalee beeksisaa saffisaa.",
        products: [
          "Mallattoolee fuula gamoo 3D",
          "Istiikara guutuu konkolaataa",
          "Waltajjii agarsiisaa fi duubbee",
          "Meeshaalee kennaa beeksisaa",
        ],
      },
    },
  },
  {
    slug: "hospitality-consumer",
    icon: "UtensilsCrossed",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    order: 6,
    active: true,
    translations: {
      en: {
        title: "Consumer Brands & Luxury Hospitality",
        subtitle: "Hotels, resorts, specialty coffee exporters, luxury retailers",
        description:
          "Rigid magnetic presentation cartons, tear-resistant restaurant menus, guest directory folios, and specialty label stickers for retail products.",
        products: [
          "Rigid coffee & cosmetic gift cartons",
          "Laminated wipeable restaurant menus",
          "Keycard wallets & hotel stationery",
          "High-adhesion product roll labels",
        ],
      },
      am: {
        title: "የሆቴሎች፣ ሬስቶራንቶች እና የሸማች ምርቶች",
        subtitle: "ሆቴሎች፣ ሪዞርቶች፣ የቡና ላኪዎች፣ የቅንጦት እቃዎች ቸርቻሪዎች",
        description:
          "ጠንካራ የቡና እና የኮስሞቲክስ ማሸጊያ ሳጥኖች፣ ውሃ የማያበላሸው የሬስቶራንት ሜኑ፣ የሆቴል ቁልፍ ኪሶች እና የምርት መለጠፊያ ስቲከሮች።",
        products: [
          "የቡና እና የቅንጦት እቃዎች ጠንካራ ሳጥኖች (Rigid Boxes)",
          "ላሚኔት የተደረገ የሚፀዳ የምግብ ዝርዝር (Menu)",
          "የሆቴል ቁልፍ ካርድ ኪስ እና እስክሪብቶ",
          "ጠንካራ የማጣበቅ አቅም ያላቸው የምርት ሮል ሌብሎች",
        ],
      },
      om: {
        title: "Hotellota, Maamiltoota fi Oomishaalee",
        subtitle: "Hotellota, rizoortota, al-ergitoota bunaa fi daldaltoota",
        description:
          "Saanduqa bunaa fi meeshaalee miidhaginaa jabaa, meenuu nyaataa bishaan hin balleessine, fi istiikara oomishaa.",
        products: [
          "Saanduqa kennaa bunaa fi meeshaalee miidhaginaa",
          "Meenuu nyaataa qulqullaa'uu danda'u",
          "Qola kaardii furtuu hoteelaa",
          "Leebilii oomishaa maxxanan",
        ],
      },
    },
  },
];
