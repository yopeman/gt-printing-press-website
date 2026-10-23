"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { type Locale } from "@/types/database";
import { TiltCard, StatusBadge, MediaModal, MediaItem } from "@/components/ui";
import {
  MapPin,
  ArrowRight,
  Sparkles,
  Layers,
  Play,
  Film,
  Video,
  Hash,
  X,
  ExternalLink,
} from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "All Projects" },
  { key: "signage", label: "Signage & 3D" },
  { key: "packaging", label: "Packaging" },
  { key: "publishing", label: "Publishing" },
  { key: "branding", label: "Corporate Branding" },
] as const;

export default function PortfolioPage() {
  const locale = useLocale() as Locale;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeHashTag, setActiveHashTag] = useState<string | null>(null);

  // Modal Player State
  const [activeModalMedia, setActiveModalMedia] = useState<MediaItem[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch live portfolio projects from DB
  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.projects && data.projects.length > 0) {
          setItems(data.projects);
        }
      })
      .catch((err) => console.error("Error loading portfolio:", err))
      .finally(() => setLoading(false));
  }, []);

  // Sync with URL Hash (#tag)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#+/, "").trim().toLowerCase();
      if (hash) {
        setActiveHashTag(hash);
      } else {
        setActiveHashTag(null);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleSelectHashTag = (tag: string) => {
    const cleaned = tag.replace(/^#+/, "").trim().toLowerCase();
    if (activeHashTag === cleaned) {
      window.location.hash = "";
      setActiveHashTag(null);
    } else {
      window.location.hash = cleaned;
      setActiveHashTag(cleaned);
    }
  };

  const clearHashTag = () => {
    window.location.hash = "";
    setActiveHashTag(null);
  };

  // Collect all unique hashtags across projects
  const allAvailableTags = Array.from(
    new Set(
      items.flatMap((item) => (item.tags || []).map((t: string) => t.toLowerCase()))
    )
  ).slice(0, 10);

  // Filter Items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      item.category === selectedCategory ||
      (selectedCategory === "signage" && item.category?.includes("signage")) ||
      (selectedCategory === "packaging" && item.category?.includes("packaging")) ||
      (selectedCategory === "publishing" && item.category?.includes("publishing")) ||
      (selectedCategory === "branding" && item.category?.includes("branding"));

    const matchesHash =
      !activeHashTag ||
      (item.tags || []).some(
        (t: string) => t.toLowerCase() === activeHashTag.toLowerCase()
      ) ||
      item.slug.toLowerCase().includes(activeHashTag.toLowerCase());

    return matchesCategory && matchesHash;
  });

  const openMediaModal = (mediaList: MediaItem[]) => {
    setActiveModalMedia(mediaList);
    setModalOpen(true);
  };

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <StatusBadge label="Verified In-House Track Record" variant="express" pulsingDot shimmer />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Our Work Speaks for Itself
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            Real projects fabricated in-house by GT Printing's team and machinery in Addis Ababa. Watch video documentation or filter by hashtag and industry.
          </p>
        </div>

        {/* Filter Category Segmented Control */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-surface-secondary/70 border border-border backdrop-blur-md">
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

          {/* Hashtag Quick Filter Row */}
          {allAvailableTags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-foreground-muted flex items-center gap-1 mr-1">
                <Hash className="w-3 h-3 text-primary" />
                <span>Popular Tags:</span>
              </span>
              {allAvailableTags.map((tag) => {
                const isSelected = activeHashTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSelectHashTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                      isSelected
                        ? "bg-primary text-white shadow-glow-sm"
                        : "bg-surface border border-border text-foreground-muted hover:text-foreground hover:border-primary/40"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Hashtag Banner */}
          {activeHashTag && (
            <div className="flex items-center justify-center gap-2 pt-1 animate-in fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-bold shadow-xs">
                <span>Filtering by: #{activeHashTag}</span>
                <button
                  type="button"
                  onClick={clearHashTag}
                  className="hover:text-red-500 transition-colors p-0.5"
                  title="Clear hashtag filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-3xl bg-surface border border-border overflow-hidden animate-pulse h-full"
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
        ) : (
          /* Animated Grid */
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.map((item) => {
              const mediaItems: MediaItem[] = [
                ...(item.mediaLinks || []).map((ml: any) => ({
                  type: ml.type,
                  url: ml.url,
                  title: ml.title || item.title[locale] || item.title.en,
                })),
                ...(item.galleryImages || [item.coverImage]).map((url: string) => ({
                  type: "image" as const,
                  url,
                  title: item.title[locale] || item.title.en,
                })),
              ];

              const hasVideos = (item.mediaLinks || []).some(
                (ml: any) => ml.type === "youtube" || ml.type === "youtube_short" || ml.type === "vimeo"
              );

              return (
                <motion.div
                  key={item.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <TiltCard className="flex flex-col justify-between group h-full">
                    {/* Image / Media Trigger */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl bg-surface-secondary">
                      <img
                        src={item.coverImage}
                        alt={item.title[locale] || item.title.en}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => openMediaModal(mediaItems)}
                      />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-background/85 backdrop-blur-md border border-border text-[10px] font-bold uppercase tracking-wider text-primary">
                          {item.categoryLabel?.[locale] || item.categoryLabel?.en || item.category}
                        </span>
                      </div>

                      {/* Video / Media Play Button Overlay */}
                      {hasVideos && (
                        <button
                          type="button"
                          onClick={() => openMediaModal(mediaItems)}
                          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-primary/90 hover:bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-xs transition-transform hover:scale-105"
                          title="Watch video presentation"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Video</span>
                        </button>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-[11px] text-foreground-muted font-medium">
                          <span className="font-semibold text-foreground">{item.clientName}</span>
                          <span>•</span>
                          <span>{item.year}</span>
                        </div>

                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {item.title[locale] || item.title.en}
                        </h3>

                        <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                          {item.summary?.[locale] || item.summary?.en || ""}
                        </p>

                        {/* Hashtag Chips */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {item.tags.map((tag: string) => {
                              const cleaned = tag.replace(/^#+/, "").toLowerCase();
                              const isSelected = activeHashTag === cleaned;
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSelectHashTag(cleaned);
                                  }}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-all ${
                                    isSelected
                                      ? "bg-primary text-white"
                                      : "bg-surface-secondary border border-border text-primary hover:bg-primary/10"
                                  }`}
                                >
                                  #{cleaned}
                                </button>
                              );
                            })}
                          </div>
                        )}
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
                          <MapPin className="w-3 h-3 text-primary shrink-0" />
                          <span className="truncate max-w-[110px]">
                            {item.location ? item.location.split(",")[0] : "Addis Ababa"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filteredItems.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <Layers className="w-10 h-10 text-foreground-muted/40 mx-auto" />
            <h3 className="text-base font-bold text-foreground">No matching projects found</h3>
            <p className="text-xs text-foreground-muted">
              Try choosing a different category or clearing your active hashtag filter.
            </p>
            {activeHashTag && (
              <button
                type="button"
                onClick={clearHashTag}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-glow-sm"
              >
                Clear #{activeHashTag}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Media Modal Player */}
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        media={activeModalMedia}
      />
    </div>
  );
}
