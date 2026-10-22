"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { type Locale } from "@/types/database";
import { TiltCard } from "@/components/ui/tilt-card";
import { ArrowRight, MapPin, Layers } from "lucide-react";

export function PortfolioReel() {
  const locale = useLocale() as Locale;
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.projects && data.projects.length > 0) {
          const featured = data.projects.filter((p: any) => p.featured);
          const displayItems = featured.length > 0 ? featured.slice(0, 3) : data.projects.slice(0, 3);
          setFeaturedItems(displayItems);
        }
      })
      .catch((err) => console.error("Error loading portfolio reel:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-surface border border-border overflow-hidden animate-pulse flex flex-col justify-between"
            >
              <div className="aspect-[16/10] bg-surface-secondary/70" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-1/3 bg-surface-secondary rounded" />
                <div className="h-5 w-3/4 bg-surface-secondary rounded" />
                <div className="h-3 w-full bg-surface-secondary rounded" />
                <div className="pt-4 border-t border-border/50 flex justify-between">
                  <div className="h-4 w-20 bg-surface-secondary rounded" />
                  <div className="h-4 w-16 bg-surface-secondary rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : featuredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredItems.map((item) => {
            const locTitle = item.title?.[locale] || item.title?.en || item.slug;
            const locCat = item.categoryLabel?.[locale] || item.categoryLabel?.en || item.category;
            const locSummary = item.summary?.[locale] || item.summary?.en || "";
            const locationStr = item.location ? item.location.split(",")[0] : "Addis Ababa";

            return (
              <TiltCard key={item.slug} className="flex flex-col justify-between group">
                {/* Image Container with aspect ratio */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl bg-surface-secondary">
                  <img
                    src={item.coverImage}
                    alt={locTitle}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-bold uppercase tracking-wider text-primary">
                      {locCat}
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

                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
                      {locTitle}
                    </h3>

                    <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                      {locSummary}
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
                      <span className="truncate max-w-[110px]">{locationStr}</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-foreground-muted">
          No featured projects published yet.
        </div>
      )}

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
