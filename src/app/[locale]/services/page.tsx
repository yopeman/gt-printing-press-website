"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { SERVICES_DATA } from "@/data/services";
import { type Locale } from "@/types/database";
import { TiltCard, IconBox } from "@/components/ui";
import { ArrowRight, Clock } from "lucide-react";
import { ServicesHeroSection } from "./ServicesHeroSection";

export default function ServicesPage() {
  const locale = useLocale() as Locale;

  return (
    <div className="relative overflow-hidden py-8 md:py-16">
      {/* Background ambient lighting */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[130px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Split Hero Section with Circular Carousel on the right side using Portfolio CMS images */}
        <ServicesHeroSection locale={locale} />

        {/* 6 Services Deep-Dive Grid Section */}
        <div id="services-grid" className="space-y-8 pt-8 border-t border-border/70 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-primary">
              Core Plant Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Detailed Manufacturing Specifications
            </h2>
            <p className="text-sm text-foreground-muted">
              Select any division below to explore comprehensive machinery specifications, materials, finishes, and typical output options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {SERVICES_DATA.map((srv, idx) => (
              <div key={srv.slug} id={`service-${srv.slug}`} className="scroll-mt-28">
                <TiltCard className="flex flex-col justify-between group p-6 h-full transition-all duration-300 hover:border-primary/40">
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
                        {srv.title[locale] || srv.title.en}
                      </h3>
                      <p className="text-xs text-foreground-muted leading-relaxed line-clamp-3">
                        {srv.shortDesc[locale] || srv.shortDesc.en}
                      </p>
                    </div>

                    {/* Key products pill strip */}
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted block mb-2">
                        Typical Outputs
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(srv.typicalProducts[locale] || srv.typicalProducts.en).slice(0, 3).map((prod, pIdx) => (
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
                      <span className="truncate">{srv.turnaroundTime[locale] || srv.turnaroundTime.en}</span>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
