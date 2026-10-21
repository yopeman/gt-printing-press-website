import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { SERVICES_DATA } from "@/data/services";
import { type Locale } from "@/types/database";
import { TiltCard, IconBox, StatusBadge } from "@/components/ui";
import { ArrowRight, CheckCircle2, Sparkles, Clock } from "lucide-react";

export default function ServicesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[130px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <StatusBadge label="Industrial Printing & Fabrication" variant="express" pulsingDot shimmer />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Complete In-House Services
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            From precision color-critical corporate publications and structural retail packaging to heavy 3D illuminated architectural signage, explore our six core manufacturing divisions.
          </p>
        </div>

        {/* 6 Services Deep-Dive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SERVICES_DATA.map((srv, idx) => (
            <TiltCard key={srv.slug} className="flex flex-col justify-between group p-6">
              <div className="space-y-4">
                {/* Header with Glyph & Badge */}
                <div className="flex items-center justify-between">
                  <IconBox
                    glyph={srv.glyph}
                    size="lg"
                    variant="primary"
                    hoverPulse
                    hoverSpin={srv.glyph === "offset-roller"}
                  />
                  <span className="text-[11px] font-mono font-bold text-foreground-muted px-2.5 py-1 rounded-full bg-surface-secondary border border-border">
                    0{idx + 1}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {srv.title[loc] || srv.title.en}
                  </h3>
                  <p className="text-xs text-foreground-muted leading-relaxed line-clamp-3">
                    {srv.shortDesc[loc] || srv.shortDesc.en}
                  </p>
                </div>

                {/* Key products pill strip */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted block mb-2">
                    Typical Outputs
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(srv.typicalProducts[loc] || srv.typicalProducts.en).slice(0, 3).map((prod, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2 py-0.5 rounded-md bg-surface-secondary border border-border text-[10px] font-medium text-foreground/80"
                      >
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Turnaround speed indicator */}
                <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted pt-2 border-t border-border/60">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate">{srv.turnaroundTime[loc] || srv.turnaroundTime.en}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-border mt-6 flex items-center justify-between gap-2">
                <Link
                  href={`/services/${srv.slug}`}
                  className="text-xs font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>Explore Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/quote?service=${srv.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 text-xs font-semibold transition-all"
                >
                  Get Quote
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
