import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  GraduationCap,
  Building,
  HeartPulse,
  Landmark,
  Globe2,
  UtensilsCrossed,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { StatusBadge, TiltCard } from "@/components/ui";

export default function IndustriesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const industries = [
    {
      icon: Landmark,
      title: "Banking & Financial Institutions",
      subtitle: "Awash Bank, Oromia Bank, Commercial Cooperatives",
      desc: "High-security corporate printing, anti-counterfeit certificates, recurring annual reports, and standardized multi-branch 3D illuminated architectural signage.",
      products: ["Annual reports & financial statements", "3D illuminated branch storefront letters", "Anti-copy tamper-evident forms", "Executive desk accessories & diaries"],
    },
    {
      icon: GraduationCap,
      title: "Schools, Universities & Educational Institutions",
      subtitle: "National curriculum publishers, private academies, universities",
      desc: "High-throughput textbook printing, serialized final examinations, security diplomas with holographic foil validation, and durable wire-stitched workbooks.",
      products: ["Student textbooks & exercise books", "Graduation diplomas & security certificates", "School catalogs & prospectuses", "ID cards & academic yearbooks"],
    },
    {
      icon: HeartPulse,
      title: "Medical & Healthcare Facilities",
      subtitle: "Hospitals, specialty clinics, pharmaceutical distributors",
      desc: "Confidential diagnostic stationery, patient administrative folders, serialized prescription books, and certified folding cartons for medical supplies.",
      products: ["Numbered prescription pads", "Patient chart folders & medical records", "Pharmaceutical packaging folding cartons", "Clinical wayfinding & clinic signage"],
    },
    {
      icon: Globe2,
      title: "Diplomatic Missions & International NGOs",
      subtitle: "UN agencies, foreign embassies, international humanitarian bodies",
      desc: "Bilingual and trilingual research monographs, multi-color field manuals, conference backdrops, and executive humanitarian documentation suites.",
      products: ["Trilingual research monographs", "Durable conference roll-up banners", "Hard-cover casebound publications", "Custom event packaging kits"],
    },
    {
      icon: Building,
      title: "Corporate & Event Branding",
      subtitle: "Telecommunications, construction enterprises, tech firms",
      desc: "High-impact retail promotional displays, vehicle fleet branding, premium presentation folders, and rapid regional marketing campaign materials.",
      products: ["3D channel letter facade signage", "Vehicle wrap graphics & decals", "Event exhibition booths & backdrops", "Promotional gift merchandise"],
    },
    {
      icon: UtensilsCrossed,
      title: "Consumer Brands & Luxury Hospitality",
      subtitle: "Hotels, resorts, specialty coffee exporters, luxury retailers",
      desc: "Rigid magnetic presentation cartons, tear-resistant restaurant menus, guest directory folios, and specialty label stickers for retail products.",
      products: ["Rigid coffee & cosmetic gift cartons", "Laminated wipeable restaurant menus", "Keycard wallets & hotel stationery", "High-adhesion product roll labels"],
    },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <StatusBadge label="Tailored Sector Solutions" variant="express" pulsingDot shimmer />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Industries We Serve
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            Every sector requires distinct materials, security controls, and turnaround velocities. Discover how GT Printing tailors manufacturing lines to meet the strict demands of your industry.
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <TiltCard key={idx} className="p-8 flex flex-col justify-between group space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {ind.title}
                      </h3>
                      <span className="text-xs text-foreground-muted">
                        {ind.subtitle}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                    {ind.desc}
                  </p>

                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted block mb-2 font-mono">
                      Specialized Deliverables
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground">
                      {ind.products.map((p, pIdx) => (
                        <li key={pIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <Link
                    href={`/quote?industry=${encodeURIComponent(ind.title)}`}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-1.5 transition-all"
                  >
                    <span>Request Industry Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
