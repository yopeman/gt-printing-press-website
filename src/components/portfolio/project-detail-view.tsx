"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { type Locale } from "@/types/database";
import { MediaModal, MediaItem } from "@/components/ui";
import {
  ArrowRight,
  ChevronLeft,
  MapPin,
  Calendar,
  Building,
  Layers,
  Sparkles,
  CheckCircle2,
  Play,
  Film,
  Video,
  Hash,
  ExternalLink,
  Share2,
} from "lucide-react";

interface ProjectDetailViewProps {
  project: any;
  locale: Locale;
}

export function ProjectDetailView({ project, locale }: ProjectDetailViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState<MediaItem[] | null>(null);
  const [initialIndex, setInitialIndex] = useState(0);

  // Combine media links and gallery images into media items
  const allMediaItems: MediaItem[] = [
    ...(project.mediaLinks || []).map((ml: any) => ({
      type: ml.type,
      url: ml.url,
      title: ml.title || project.title[locale] || project.title.en,
    })),
    ...(project.galleryImages || [project.coverImage]).map((url: string, idx: number) => ({
      type: "image" as const,
      url,
      title: `${project.title[locale] || project.title.en} - Photo ${idx + 1}`,
    })),
  ];

  const hasVideos = (project.mediaLinks || []).some(
    (ml: any) => ml.type === "youtube" || ml.type === "youtube_short" || ml.type === "vimeo"
  );

  const openModal = (items: MediaItem[], index = 0) => {
    setModalMedia(items);
    setInitialIndex(index);
    setModalOpen(true);
  };

  return (
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
        <span className="text-foreground truncate max-w-md">
          {project.title[locale] || project.title.en}
        </span>
      </div>

      {/* Project Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold font-mono text-primary uppercase">
            {project.categoryLabel?.[locale] || project.categoryLabel?.en || project.category}
          </span>
          <span className="text-xs text-foreground-muted flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            Completed in {project.year}
          </span>
          <span className="text-xs text-foreground-muted flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {project.location}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
          {project.title[locale] || project.title.en}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Building className="w-4 h-4 text-primary" />
            <span>Client:</span>
            <span className="font-bold">{project.clientName}</span>
          </div>

          {/* Hashtag Badges */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {project.tags.map((tag: string) => {
                const cleaned = tag.replace(/^#+/, "").toLowerCase();
                return (
                  <Link
                    key={tag}
                    href={`/portfolio#${cleaned}`}
                    className="px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/25 text-primary text-xs font-mono font-bold transition-all flex items-center gap-0.5"
                  >
                    <span>#{cleaned}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Hero Image with Play Overlay */}
      <div className="relative rounded-3xl overflow-hidden border border-border shadow-card-glass aspect-[16/9] bg-surface-secondary group">
        <img
          src={project.coverImage}
          alt={project.title[locale] || project.title.en}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover cursor-pointer group-hover:scale-102 transition-transform duration-500"
          onClick={() => openModal(allMediaItems, 0)}
        />

        {/* Video / Media Play Badge */}
        {hasVideos && (
          <button
            type="button"
            onClick={() => openModal(allMediaItems, 0)}
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Watch Project Video</span>
          </button>
        )}
      </div>

      {/* External Media Links Section (YouTube, Shorts, Vimeo, Social) */}
      {project.mediaLinks && project.mediaLinks.length > 0 && (
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-card-glass space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              <span>Project Video Showcases & Media Links</span>
            </h2>
            <span className="text-xs font-mono text-foreground-muted">
              {project.mediaLinks.length} Links Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {project.mediaLinks.map((ml: any, idx: number) => {
              const isYt = ml.type === "youtube" || ml.type === "youtube_short";
              const isVimeo = ml.type === "vimeo";
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => openModal([ml], 0)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-secondary hover:bg-surface-secondary/80 border border-border hover:border-primary/40 text-left transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    {isYt ? (
                      <Play className="w-5 h-5 fill-current" />
                    ) : isVimeo ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-foreground truncate">
                      {ml.title || `${ml.type.replace("_", " ")} Showcase`}
                    </div>
                    <div className="text-[11px] text-foreground-muted truncate font-mono">
                      {ml.type.toUpperCase()} • Click to watch
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Project Narrative & Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Project Overview & Execution</h2>
          <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
            {project.fullDescription?.[locale] || project.fullDescription?.en || project.summary?.[locale] || project.summary?.en}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 font-mono">
            <Layers className="w-4 h-4 text-primary" />
            <span>Materials & Finishes</span>
          </h3>
          <ul className="space-y-2 text-xs text-foreground font-mono">
            {(project.materialsUsed || []).map((mat: string, i: number) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{mat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Photo Gallery with Fullscreen Zoom Modal */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Project Detail Gallery</h2>
            <span className="text-xs font-mono text-foreground-muted">
              Click any photo to enlarge
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {project.galleryImages.map((img: string, i: number) => {
              const galleryMediaList: MediaItem[] = project.galleryImages.map(
                (url: string, gIdx: number) => ({
                  type: "image" as const,
                  url,
                  title: `${project.title[locale] || project.title.en} (${gIdx + 1}/${project.galleryImages.length})`,
                })
              );

              return (
                <div
                  key={i}
                  onClick={() => openModal(galleryMediaList, i)}
                  className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-secondary border border-border cursor-pointer group relative"
                >
                  <img
                    src={img}
                    alt={`${project.clientName} showcase ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-xl bg-surface/90 text-foreground text-xs font-bold">
                      Enlarge Photo
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      {/* Media Modal */}
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        media={modalMedia}
        initialIndex={initialIndex}
      />
    </div>
  );
}
