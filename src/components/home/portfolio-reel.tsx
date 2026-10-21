"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { type Locale } from "@/types/database";
import { TiltCard } from "@/components/ui/tilt-card";
import { ArrowRight, MapPin, Calendar, Sparkles } from "lucide-react";

export function PortfolioReel() {
  const locale = useLocale() as Locale;
  const featuredItems = PORTFOLIO_DATA.filter((item) => item.featured).slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredItems.map((item) => (
          <TiltCard key={item.slug} className="flex flex-col justify-between group">
            {/* Image Container with fetchpriority and aspect ratio */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl bg-surface-secondary">
              <img
                src={item.coverImage}
                alt={item.title[locale] || item.title.en}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-bold uppercase tracking-wider text-primary">
                  {item.categoryLabel[locale] || item.categoryLabel.en}
                </span>
              </div>
            </div>

            {/* Info Block */}
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-foreground-muted font-medium">
                  <span className="font-semibold text-foreground">{item.clientName}</span>
                  <span>•</span>
                  <span>{item.year}</span>
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {item.title[locale] || item.title.en}
                </h3>

                <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                  {item.summary[locale] || item.summary.en}
                </p>
              </div>

              {/* Action Link */}
              <div className="pt-4 border-t border-border/70 mt-4 flex items-center justify-between">
                <Link
                  href={`/portfolio/${item.slug}`}
                  className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-1.5 transition-all"
                >
                  <span>View Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-1 text-[11px] text-foreground-muted">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="truncate max-w-[110px]">{item.location.split(",")[0]}</span>
                </div>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      <div className="text-center pt-2">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface hover:bg-surface-secondary border border-border text-xs sm:text-sm font-bold text-foreground transition-colors shadow-sm"
        >
          <span>Explore Complete Verified Portfolio</span>
          <ArrowRight className="w-4 h-4 text-primary" />
        </Link>
      </div>
    </div>
  );
}
