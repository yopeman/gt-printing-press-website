import React from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { SERVICES_DATA } from "@/data/services";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { type Locale } from "@/types/database";
import { routing } from "@/i18n/routing";
import { IconBox, StatusBadge, TiltCard } from "@/components/ui";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  FileText,
  MapPin,
  ChevronLeft,
} from "lucide-react";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    for (const service of SERVICES_DATA) {
      params.push({
        locale,
        slug: service.slug,
      });
    }
  }

  return params;
}

export default function ServiceDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  const service = SERVICES_DATA.find((s) => s.slug === slug);
  if (!service) {
    notFound();
  }

  // Related portfolio projects matching this service category
  const relatedProjects = PORTFOLIO_DATA.filter((p) => {
    if (slug.includes("signage")) return p.category === "signage";
    if (slug.includes("packaging")) return p.category === "packaging";
    if (slug.includes("publishing")) return p.category === "publishing";
    return p.category === "branding";
  }).slice(0, 2);

  return (
    <div className="relative overflow-hidden py-10 md:py-16">
      {/* Background Glow */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[130px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 max-w-6xl">
        {/* Breadcrumb / Back Link */}
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground-muted">
          <Link
            href="/services"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Services</span>
          </Link>
          <span>/</span>
          <span className="text-foreground">{service.title[loc] || service.title.en}</span>
        </div>

        {/* Hero Banner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <IconBox glyph={service.glyph} size="lg" variant="primary" hoverPulse />
              <StatusBadge
                label={service.turnaroundTime[loc] || service.turnaroundTime.en}
                variant="express"
                pulsingDot
                shimmer
              />
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              {service.title[loc] || service.title.en}
            </h1>

            <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
              {service.fullDesc[loc] || service.fullDesc.en}
            </p>

            {/* Direct CTA with preselected service */}
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href={`/quote?service=${service.slug}`}
                className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-glow-md hover:shadow-glow-lg transition-all flex items-center gap-2"
              >
                <span>Request a Quote for this Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/capabilities"
                className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-secondary text-foreground font-semibold text-sm border border-border transition-colors flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-primary" />
                <span>View Machinery</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <TiltCard className="p-2">
              <img
                src={service.coverImage}
                alt={service.title[loc] || service.title.en}
                loading="eager"
                decoding="async"
                className="rounded-2xl w-full h-[320px] object-cover"
              />
            </TiltCard>
          </div>
        </div>

        {/* Technical Specs & Finishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/80">
          {/* Typical Products */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Typical Products & Applications</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-foreground-muted">
              {(service.typicalProducts[loc] || service.typicalProducts.en).map((prod, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-foreground">{prod}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Available Finishes & Materials */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <span>Available Finishes & Materials</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-foreground-muted">
              {(service.finishesAndMaterials[loc] || service.finishesAndMaterials.en).map((fin, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{fin}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Machinery Employed */}
        <div className="p-6 rounded-2xl bg-surface-secondary/40 border border-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-foreground-muted block">
              Dedicated In-House Plant Machinery
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {service.equipmentUsed.map((eq, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-surface border border-border text-xs font-semibold text-foreground font-mono"
                >
                  {eq}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/capabilities"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>See full plant equipment list</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Photo Gallery */}
        <div className="space-y-4 pt-6">
          <h3 className="text-xl font-bold text-foreground">
            Production & Sample Gallery
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {service.galleryImages.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-secondary border border-border group">
                <img
                  src={img}
                  alt={`${service.title.en} sample ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Related Portfolio Projects */}
        {relatedProjects.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-border">
            <h3 className="text-xl font-bold text-foreground">
              Completed Projects in this Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedProjects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/portfolio/${p.slug}`}
                  className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-colors flex items-center gap-4 group"
                >
                  <img
                    src={p.coverImage}
                    alt={p.title[loc] || p.title.en}
                    loading="lazy"
                    decoding="async"
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      {p.clientName}
                    </span>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {p.title[loc] || p.title.en}
                    </h4>
                    <span className="text-xs text-foreground-muted mt-1 block">
                      {p.location}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
