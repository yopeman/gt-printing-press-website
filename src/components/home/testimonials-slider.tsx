"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { TESTIMONIALS_DATA, CLIENT_LOGOS } from "@/data/testimonials";
import { type Locale } from "@/types/database";
import { Star, ChevronLeft, ChevronRight, Quote, Building2 } from "lucide-react";

export function TestimonialsSlider() {
  const locale = useLocale() as Locale;
  const [items, setItems] = useState<any[]>(TESTIMONIALS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    async function loadTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          if (data.testimonials && data.testimonials.length > 0) {
            const mapped = data.testimonials.map((t: any) => ({
              id: t._id || t.id,
              name: t.clientName || t.name,
              role: t.role,
              company: t.company,
              rating: t.rating || 5,
              avatarUrl: t.avatarUrl,
              quote: t.translations
                ? {
                    en: t.translations.en?.quote || "",
                    am: t.translations.am?.quote || t.translations.en?.quote || "",
                    om: t.translations.om?.quote || t.translations.en?.quote || "",
                  }
                : t.quote,
            }));
            setItems(mapped);
          }
        }
      } catch (err) {
        console.warn("Using offline fallback testimonials:", err);
      }
    }
    loadTestimonials();
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const current = items[currentIndex] || items[0] || TESTIMONIALS_DATA[0];

  return (
    <div className="w-full space-y-16">
      {/* Client Logos Strip */}
      <div className="space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted block font-mono">
          Trusted by Ethiopia's Leading Financial, Diplomatic & Enterprise Brands
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-5xl mx-auto">
          {CLIENT_LOGOS.map((client) => (
            <div
              key={client.name}
              className="px-4 py-2.5 rounded-xl bg-surface border border-border/80 shadow-sm flex items-center gap-2 text-xs font-semibold text-foreground/80 hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-primary" />
              <span>{client.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Carousel Card */}
      <div className="max-w-4xl mx-auto relative">
        <div className="p-5 sm:p-12 rounded-3xl bg-surface border border-border shadow-card-glass relative overflow-hidden">
          <Quote className="absolute top-6 right-8 w-20 h-20 text-primary/10 pointer-events-none -z-0" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 space-y-6"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="text-base sm:text-xl font-medium text-foreground leading-relaxed italic">
                "{current.quote[locale] || current.quote.en}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/70">
                <div className="min-w-0">
                  <div className="font-bold text-foreground text-sm sm:text-base">
                    {current.name}
                  </div>
                  <div className="text-xs text-foreground-muted">
                    {current.role} • <span className="font-medium text-primary">{current.company}</span>
                  </div>
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous testimonial"
                    className="p-2 rounded-xl bg-surface-secondary border border-border hover:bg-surface text-foreground hover:text-primary transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next testimonial"
                    className="p-2 rounded-xl bg-surface-secondary border border-border hover:bg-surface text-foreground hover:text-primary transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
