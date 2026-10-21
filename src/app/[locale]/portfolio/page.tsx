"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { type Locale } from "@/types/database";
import { TiltCard, StatusBadge } from "@/components/ui";
import { MapPin, ArrowRight, Sparkles, Layers } from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "All Projects" },
  { key: "signage", label: "Signage & 3D" },
  { key: "packaging", label: "Packaging" },
  { key: "publishing", label: "Publishing" },
  { key: "branding", label: "Corporate Branding" },
] as const;

export default function PortfolioPage() {
  const locale = useLocale() as Locale;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredItems = PORTFOLIO_DATA.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <StatusBadge label="Verified In-House Track Record" variant="express" pulsingDot shimmer />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Our Work Speaks for Itself
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            Only real projects produced by GT Printing's team and machinery in Addis Ababa. Filter by signage, structural packaging, or volume publication printing.
          </p>
        </div>

        {/* Filter Category Segmented Control */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto p-1.5 rounded-2xl bg-surface-secondary/70 border border-border backdrop-blur-md">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`relative px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors ${
                  isActive ? "text-primary" : "text-foreground-muted hover:text-foreground"
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activePortfolioTab"
                    className="absolute inset-0 rounded-xl bg-surface shadow-sm border border-border -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Animated Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <TiltCard className="flex flex-col justify-between group h-full">
                  {/* Image */}
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

                  {/* Info */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
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

                    <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                      <Link
                        href={`/portfolio/${item.slug}`}
                        className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-1.5 transition-all"
                      >
                        <span>View Project Case</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="flex items-center gap-1 text-[11px] text-foreground-muted">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="truncate max-w-[110px]">
                          {item.location.split(",")[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
