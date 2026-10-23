import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getDbIndustries } from "@/lib/data-service";
import { type Locale } from "@/types/database";
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
  Factory,
  ShieldCheck,
  Award,
  ExternalLink,
  Play,
} from "lucide-react";
import { StatusBadge, TiltCard } from "@/components/ui";

const ICON_MAP: Record<string, any> = {
  Landmark,
  GraduationCap,
  HeartPulse,
  Globe2,
  Building,
  UtensilsCrossed,
  Factory,
  ShieldCheck,
  Award,
};

export default async function IndustriesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  const industries = await getDbIndustries();

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
            const Icon = ICON_MAP[ind.icon] || Building;
            const t = ind.translations?.[loc] || ind.translations?.en;
            const title = t?.title || ind.slug;
            const subtitle = t?.subtitle || "";
            const desc = t?.description || "";
            const products = t?.products || [];

            return (
              <TiltCard key={ind._id || idx} className="p-8 flex flex-col justify-between group space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      {subtitle && (
                        <span className="text-xs text-foreground-muted">
                          {subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                    {desc}
                  </p>

                  {products.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted block mb-2 font-mono">
                        Specialized Deliverables
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground">
                        {products.map((p, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Media / File Links if configured */}
                  {ind.mediaLinks && ind.mediaLinks.length > 0 && (
                    <div className="pt-3 border-t border-border/80 flex flex-wrap gap-2">
                      {ind.mediaLinks.map((ml, mIdx) => (
                        <a
                          key={mIdx}
                          href={ml.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-primary/10 border border-border text-[11px] font-semibold text-foreground hover:text-primary transition-all flex items-center gap-1.5"
                        >
                          <Play className="w-3 h-3 text-primary fill-primary" />
                          <span>{ml.title || "Industry Case Study"}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-foreground-muted" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <Link
                    href={`/quote?industry=${encodeURIComponent(title)}`}
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
