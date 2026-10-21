import React from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { type Locale } from "@/types/database";
import { routing } from "@/i18n/routing";
import { StatusBadge, TiltCard } from "@/components/ui";
import {
  ArrowRight,
  ChevronLeft,
  MapPin,
  Calendar,
  Building,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    for (const item of PORTFOLIO_DATA) {
      params.push({
        locale,
        slug: item.slug,
      });
    }
  }

  return params;
}

export default function PortfolioDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  const project = PORTFOLIO_DATA.find((p) => p.slug === slug);
  if (!project) {
    notFound();
  }

  return (
    <div className="relative overflow-hidden py-10 md:py-16">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[130px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 max-w-5xl">
        {/* Back Link */}
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground-muted">
          <Link
            href="/portfolio"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Portfolio Projects</span>
          </Link>
          <span>/</span>
          <span className="text-foreground">{project.title[loc] || project.title.en}</span>
        </div>

        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold font-mono text-primary uppercase">
              {project.categoryLabel[loc] || project.categoryLabel.en}
            </span>
            <span className="text-xs text-foreground-muted flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Completed in {project.year}
            </span>
            <span className="text-xs text-foreground-muted flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {project.location}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            {project.title[loc] || project.title.en}
          </h1>

          <div className="flex items-center gap-2 text-sm text-foreground">
            <Building className="w-4 h-4 text-primary" />
            <span>Client:</span>
            <span className="font-bold">{project.clientName}</span>
          </div>
        </div>

        {/* Main Hero Image */}
        <div className="rounded-3xl overflow-hidden border border-border shadow-card-glass aspect-[16/9] bg-surface-secondary">
          <img
            src={project.coverImage}
            alt={project.title[loc] || project.title.en}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Project Narrative & Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Project Overview & Execution</h2>
            <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
              {project.fullDescription[loc] || project.fullDescription.en}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-primary" />
              <span>Materials & Finishes</span>
            </h3>
            <ul className="space-y-2 text-xs text-foreground font-mono">
              {project.materialsUsed.map((mat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-xl font-bold text-foreground">Project Detail Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.galleryImages.map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-secondary border border-border">
                <img
                  src={img}
                  alt={`${project.clientName} showcase ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <div className="p-8 rounded-3xl bg-surface-secondary/40 border border-border text-center space-y-4 mt-8">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Inspired by this Project?
          </h3>
          <p className="text-xs sm:text-sm text-foreground-muted max-w-lg mx-auto">
            Discuss your upcoming architectural signage, volume printing, or structural packaging project with GT Printing today.
          </p>
          <div className="pt-2">
            <Link
              href={`/quote?service=${project.category}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-glow-sm transition-all"
            >
              <span>Request Quote for Similar Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
