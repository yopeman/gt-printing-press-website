"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  MagneticButton,
  TiltCard,
  IconBox,
  AnimatedCounter,
  StatusBadge,
} from "@/components/ui";
import { QuickQuoteModal } from "@/components/quote/quick-quote-modal";
import { HeroBackgroundSlider } from "@/components/home/hero-background-slider";
import { AddisPlantMap } from "@/components/home/addis-plant-map";
import { WorkflowPipeline } from "@/components/home/workflow-pipeline";
import { PortfolioReel } from "@/components/home/portfolio-reel";
import { TestimonialsSlider } from "@/components/home/testimonials-slider";
import { LatestBlogSection } from "@/components/home/latest-blog-section";
import {
  Printer,
  Sparkles,
  ShieldCheck,
  Clock,
  Layers,
  Cpu,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Database,
  Palette,
  Languages,
  Zap,
  Box,
  FileText,
  BadgeCheck,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations("home");
  const common = useTranslations("common");
  const services = useTranslations("services");

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const serviceShowcase = [
    {
      title: services("offsetDigital"),
      glyph: "offset-roller" as const,
      desc: "High-volume commercial offset printing & fast variable-data digital output for brand brochures, menus, and business collateral.",
      tag: "Express Available",
      href: "/services/offset-digital-printing",
    },
    {
      title: services("publishingBinding"),
      glyph: "saddle-stitch" as const,
      desc: "Magazines, annual reports, corporate profiles, and books with saddle-stitching, perfect binding, and hard-case finishing.",
      tag: "Hard-Cover & Soft",
      href: "/services/publishing-binding",
    },
    {
      title: services("packagingSolutions"),
      glyph: "foil-emboss" as const,
      desc: "Custom product packaging boxes, luxury gift cartons, labels, kiss-cutting, and custom die-cut structural papercraft.",
      tag: "Structural CAD",
      href: "/services/packaging-solutions",
    },
    {
      title: services("largeFormatSignage"),
      glyph: "uv-flatbed" as const,
      desc: "3D channel-lit storefront signs, acrylic lightboxes, rigid outdoor hoardings, roll-up banners, and vehicle wraps.",
      tag: "Turnkey Install",
      href: "/services/large-format-signage",
    },
    {
      title: services("graphicDesignPrepress"),
      glyph: "laser-beam" as const,
      desc: "Pre-flight file verification, digital color grading, CTP plate-making, and structural brand asset preparation.",
      tag: "Color Certified",
      href: "/services/graphic-design-prepress",
    },
    {
      title: services("corporatePromotional"),
      glyph: "cnc-router" as const,
      desc: "Premium stationery sets, executive gift items, corporate diaries, promotional textiles, and branded institutional items.",
      tag: "Corporate Kits",
      href: "/services/corporate-promotional-items",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* 1. Dynamic Hero with Full Animated Background Changing Every 3 Seconds */}
      <HeroBackgroundSlider onOpenQuoteModal={() => setQuoteModalOpen(true)} />

      {/* 2. Key Metrics Strip with Animated Counters */}
      <section className="py-10 bg-surface/80 border-b border-border/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TiltCard className="p-4 sm:p-5 text-left border border-border/80 hover:border-brand-red/40 transition-colors">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-red mb-1">
                <AnimatedCounter value={18} suffix="+" duration={1.8} />
              </div>
              <div className="text-xs text-foreground-muted font-medium">
                {t("stats.experienceLabel")}
              </div>
            </TiltCard>

            <TiltCard className="p-4 sm:p-5 text-left border border-border/80 hover:border-brand-red/40 transition-colors">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground mb-1">
                <AnimatedCounter value={100} suffix="%" duration={1.5} />
              </div>
              <div className="text-xs text-foreground-muted font-medium">
                {t("stats.inHouseLabel")}
              </div>
            </TiltCard>

            <TiltCard className="p-4 sm:p-5 text-left border border-border/80 hover:border-brand-red/40 transition-colors">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-red mb-1 truncate">
                {t("stats.turnaround")}
              </div>
              <div className="text-xs text-foreground-muted font-medium">
                {t("stats.turnaroundLabel")}
              </div>
            </TiltCard>

            <TiltCard className="p-4 sm:p-5 text-left border border-border/80 hover:border-brand-red/40 transition-colors">
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground mb-1">
                <AnimatedCounter value={500} suffix="+" duration={2} />
              </div>
              <div className="text-xs text-foreground-muted font-medium">
                {t("stats.satisfactionLabel")}
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 3. Services Grid with 3D Tilt Cards & Custom Industrial Glyphs */}
      <section className="py-16 md:py-24 bg-surface-secondary/30 border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <StatusBadge
              label={t("servicesSection.badge")}
              variant="neutral"
              pulsingDot={false}
              shimmer={false}
            />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {t("servicesSection.title")}
            </h2>
            <p className="text-sm text-foreground-muted">
              {t("servicesSection.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {serviceShowcase.map((srv, idx) => (
              <TiltCard key={idx} className="p-6 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <IconBox
                      glyph={srv.glyph}
                      size="lg"
                      variant="primary"
                      hoverPulse
                      hoverSpin={srv.glyph === "offset-roller"}
                    />
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-surface-secondary text-foreground-muted border border-border">
                      {srv.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-foreground-muted leading-relaxed mt-2">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/60 mt-6 flex items-center justify-between">
                  <Link
                    href={srv.href}
                    className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-1.5 transition-all"
                  >
                    <span>Explore Division</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <span className="text-[10px] font-mono text-foreground-muted">
                    0{idx + 1}
                  </span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Differentiators & Trust Section */}
      <section className="py-16 md:py-24 border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center space-y-3 mb-12">
            <StatusBadge
              label={t("trustSection.badge")}
              variant="success"
              pulsingDot
              shimmer
            />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {t("trustSection.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-3 hover:border-brand-red/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-foreground">
                {t("trustSection.item1Title")}
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {t("trustSection.item1Desc")}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-foreground">
                {t("trustSection.item2Title")}
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {t("trustSection.item2Desc")}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-3 hover:border-sky-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-foreground">
                {t("trustSection.item3Title")}
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                {t("trustSection.item3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Workflow Production Pipeline */}
      <section className="py-16 md:py-24 bg-surface-secondary/30 border-b border-border/60 content-visibility-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <StatusBadge
              label="Turnkey Production Cycle"
              variant="express"
              pulsingDot
              shimmer
            />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              From File to Finished Installation
            </h2>
            <p className="text-sm text-foreground-muted">
              Interactive 5-stage manufacturing pipeline with strict quality gates and zero third-party outsourcing.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <WorkflowPipeline />
          </div>
        </div>
      </section>

      {/* 6. Featured Verified Portfolio Showcase */}
      <section className="py-16 md:py-24 border-b border-border/60 content-visibility-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <StatusBadge
              label="Verified Track Record"
              variant="neutral"
              pulsingDot={false}
              shimmer={false}
            />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Featured Client Branding & Signage
            </h2>
            <p className="text-sm text-foreground-muted">
              Real projects delivered across banking, aviation, hospitality, and luxury retail in Ethiopia.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <PortfolioReel />
          </div>
        </div>
      </section>

      {/* 7. Interactive Map Section showing exact location 9.0311144, 38.8324246 in Addis Ababa */}
      <AddisPlantMap />

      {/* 8. Client Logos & Testimonials Slider */}
      <section className="py-16 md:py-24 bg-surface-secondary/30 border-y border-border/60 content-visibility-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsSlider />
        </div>
      </section>

      {/* 9. Latest Blog & Industry Insights */}
      <section className="py-16 md:py-24 content-visibility-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <StatusBadge
              label="Technical Guidance"
              variant="neutral"
              pulsingDot={false}
              shimmer={false}
            />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              GT Printing Technical Insights
            </h2>
            <p className="text-sm text-foreground-muted">
              Expert articles on pre-press artwork setup, paper selection, and technological trends.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <LatestBlogSection />
          </div>
        </div>
      </section>

      {/* 10. Closing Quote Conversion Strip */}
      <section className="py-20 bg-primary/5 border-t border-primary/20 relative overflow-hidden content-visibility-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-6">
          <StatusBadge
            label="Same-Day Quoting Guaranteed"
            variant="express"
            pulsingDot
            shimmer
          />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Ready to Discuss Your Next Print or Signage Project?
          </h2>
          <p className="text-sm sm:text-base text-foreground-muted leading-relaxed max-w-xl mx-auto">
            Get an exact estimate reviewed by our senior production technicians in Addis Ababa on the same working day.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              onClick={() => setQuoteModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-base shadow-glow-md hover:shadow-glow-lg transition-all"
            >
              <span>Request Same-Day Quote</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </MagneticButton>
            <a
              href="tel:+251115505050"
              className="px-6 py-4 rounded-2xl bg-surface hover:bg-surface-secondary text-foreground font-semibold text-sm border border-border shadow-sm transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-500" />
              <span>Direct Sales Line: +251 11 550 5050</span>
            </a>
          </div>
        </div>
      </section>

      {/* Global Quick Quote Modal instance for this page */}
      <QuickQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </div>
  );
}
