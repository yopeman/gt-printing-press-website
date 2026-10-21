import { Locale } from "@/types/database";

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  rating: number;
  quote: Record<Locale, string>;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "t1",
    name: "Yohannes Bekele",
    role: "Brand & Marketing Director",
    company: "Commercial Banking Institution",
    rating: 5,
    quote: {
      en: "GT Printing is the only partner in Addis Ababa who could deliver 40 regional branch signage sets and 200,000 corporate annual reports without missing a single hard deadline. Their in-house fabrication capability is genuinely unmatched.",
      am: "ጂቲ ማተሚያ ቤት ለ40 የቅርንጫፍ ሳይኔጅ ስራዎች እና ለ200,000 አመታዊ ሪፖርቶች ህትመት የሰጠነውን ጥብቅ ጊዜ ጠብቆ ያስረከበን ብቸኛው አስተማማኝ አጋራችን ነው። የራሳቸው የማምረት አቅም በእውነት ወደር የለውም።",
      om: "GT Printing dhaabbata tokkicha Finfinnee keessatti mallattoolee damee 40 fi gabaasa waggaa 200,000 yeroo eeggatee qulqullinaan nuuf dhiyeessedha.",
    },
  },
  {
    id: "t2",
    name: "Bethelhem Assefa",
    role: "Communications & Publishing Officer",
    company: "International Humanitarian Agency",
    rating: 5,
    quote: {
      en: "The color consistency on our diplomatic research publications is exceptional. Having physical contract proofs signed before running 50,000 copies gave our executive board absolute peace of mind.",
      am: "የምርምር ህትመቶቻችን የቀለም ጥራት እጅግ አስደናቂ ነው። 50,000 ቅጾች ከመታተማቸው በፊት አካላዊ ናሙናዎችን አይተን እንድናረጋግጥ ማድረጋቸው ለስራችን ፍጹም እምነት ፈጥሮልናል።",
      om: "Qulqullinni halluu barruulee keenyaa baay'ee amansiisaadha. Maxxansa bal'aan dura fakkeenya qabatamaa nuuf dhiyeessanii mirkaneessuun isaanii amantummaa guddaa uuma.",
    },
  },
  {
    id: "t3",
    name: "Tewodros Girma",
    role: "Founder & Head of Product",
    company: "Specialty Export Coffee Brand",
    rating: 5,
    quote: {
      en: "Our luxury packaging cartons won retail placements in Europe largely due to GT's sharp foil debossing and rigid magnetic boxes. You cannot distinguish their structural finish from Frankfurt or Milan packaging.",
      am: "የልዩ ቡና ማሸጊያ ሳጥኖቻችን በአውሮፓ ገበያ ተቀባይነት ያገኙት በጂቲ ማተሚያ ቤት የላቀ የሳጥን ጥራት እና የወርቅ ፎይል ውበት ምክንያት ነው። ጥራታቸው ከአውሮፓ የሚተናነስ አይደለም።",
      om: "Kaartooniin buna keenyaa gabaa Awurooppaa irratti jaallatamuun isaa sababa qulqullina saanduqa fi fooyilii warqee GT tiini. Qulqullinni isaanii kan Awurooppaatiin wal qixa.",
    },
  },
];

export const CLIENT_LOGOS = [
  { name: "Ethiopian Airlines", label: "Aviation" },
  { name: "ethio telecom", label: "Telecom" },
  { name: "Safaricom Ethiopia", label: "Telecom" },
  { name: "Awash Bank", label: "Banking" },
  { name: "Oromia Bank", label: "Banking" },
  { name: "Sheraton Addis / Marriott", label: "Hospitality" },
  { name: "British Embassy Addis Ababa", label: "Diplomatic" },
  { name: "UNHCR Ethiopia", label: "Humanitarian" },
];
