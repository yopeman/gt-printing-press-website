import React from "react";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getDbAboutContent } from "@/lib/data-service";
import { type Locale } from "@/types/database";
import {
  ShieldCheck,
  Award,
  Factory,
  Compass,
  CheckCircle2,
  Users,
  Target,
  ArrowRight,
  Printer,
  Sparkles,
  Play,
  ExternalLink,
  Video,
} from "lucide-react";
import { StatusBadge, TiltCard } from "@/components/ui";

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  const about = await getDbAboutContent();

  const paragraphs =
    about.storyParagraphs?.[loc] && about.storyParagraphs[loc].length > 0
      ? about.storyParagraphs[loc]
      : about.storyParagraphs?.en || [];

  const achievements = about.achievements || [];

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      {/* Background Glow */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-24">
        {/* Header Hero */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <StatusBadge
            label={about.heroBadge?.[loc] || about.heroBadge?.en || "Established 2000 E.C. • Addis Ababa"}
            variant="express"
            pulsingDot
            shimmer
          />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            {about.heroTitle?.[loc] || about.heroTitle?.en || "Engineering Precision Print & 3D Signage Under One Roof"}
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            {about.heroSubtitle?.[loc] || about.heroSubtitle?.en}
          </p>
        </div>

        {/* Origin Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-primary">
              <Factory className="w-4 h-4" />
              <span>{about.storyTag?.[loc] || about.storyTag?.en || "Our Evolution & Footprint"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {about.storyTitle?.[loc] || about.storyTitle?.en}
            </h2>
            <div className="space-y-4 text-sm text-foreground-muted leading-relaxed">
              {paragraphs.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>
          </div>

          <div className="relative">
            <TiltCard className="p-2 overflow-hidden">
              <div className="w-full h-[380px] rounded-2xl overflow-hidden bg-[#d3332c] flex items-center justify-center p-6 sm:p-8">
                {about.storyImage && about.storyImage.startsWith("/") ? (
                  <Image
                    src={about.storyImage}
                    alt="GT Printing Press Logo"
                    width={520}
                    height={450}
                    priority
                    className="w-full h-full max-h-[320px] object-contain"
                  />
                ) : (
                  <img
                    src={about.storyImage || "/gt-logo.png"}
                    alt="GT Printing Press Logo"
                    className="w-full h-full max-h-[320px] object-contain"
                  />
                )}
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="p-8 rounded-3xl bg-surface border border-border/80 shadow-card-glass space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {about.missionTitle?.[loc] || about.missionTitle?.en || "Our Mission"}
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              {about.missionText?.[loc] || about.missionText?.en}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-surface border border-border/80 shadow-card-glass space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {about.visionTitle?.[loc] || about.visionTitle?.en || "Our Vision"}
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              {about.visionText?.[loc] || about.visionText?.en}
            </p>
          </div>
        </div>

        {/* Corporate Media Links / Video Tour / PDF Document Credentials */}
        {about.mediaLinks && about.mediaLinks.length > 0 && (
          <div className="max-w-5xl mx-auto space-y-6 pt-4">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
                Official Media & Virtual Tours
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Corporate Resources & Facility Media
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {about.mediaLinks.map((ml, idx) => (
                <a
                  key={idx}
                  href={ml.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all flex items-center justify-between gap-4 group shadow-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {ml.type === "youtube" || ml.type === "youtube_short" || ml.type === "vimeo" ? (
                        <Play className="w-4 h-4 fill-primary" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors block truncate">
                        {ml.title || "Facility Resource"}
                      </span>
                      <span className="text-[11px] font-mono text-foreground-muted capitalize">
                        {ml.type.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-foreground-muted group-hover:text-primary shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Key Achievements Grid */}
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
              Proven Reliability
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Why Corporate Ethiopia Relies on GT
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {achievements.map((ach, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-surface border border-border shadow-sm space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 font-bold text-sm text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{ach.title?.[loc] || ach.title?.en}</span>
                </div>
                <p className="text-xs text-foreground-muted leading-relaxed pl-7">
                  {ach.desc?.[loc] || ach.desc?.en}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Plant & Workshop Photo Gallery */}
        {about.galleryUrls && about.galleryUrls.length > 0 && (
          <div className="max-w-5xl mx-auto space-y-6 pt-4">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
                Inside Our Plant
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Workshop & Plant Floor Environments
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {about.galleryUrls.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-secondary border border-border group"
                >
                  <img
                    src={img}
                    alt={`GT Printing facility photo ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-surface-secondary/40 border border-border text-center max-w-4xl mx-auto space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {about.ctaTitle?.[loc] || about.ctaTitle?.en || "Experience the GT In-House Difference"}
          </h3>
          <p className="text-sm text-foreground-muted max-w-xl mx-auto">
            {about.ctaSubtitle?.[loc] || about.ctaSubtitle?.en}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-glow-sm transition-all flex items-center gap-2"
            >
              <span>Visit Our Facility</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/capabilities"
              className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-secondary text-foreground font-semibold text-sm border border-border transition-colors"
            >
              <span>Inspect Machinery List</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
