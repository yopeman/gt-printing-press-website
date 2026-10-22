"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { BLOG_DATA } from "@/data/blog";
import { type Locale } from "@/types/database";
import { StatusBadge, MediaModal, MediaItem } from "@/components/ui";
import {
  Search,
  Clock,
  ArrowRight,
  BookOpen,
  Tag,
  Hash,
  X,
  Play,
  Film,
  Video,
} from "lucide-react";

export default function BlogListPage() {
  const locale = useLocale() as Locale;
  const [posts, setPosts] = useState<any[]>(BLOG_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Media Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<MediaItem[] | null>(null);

  // Fetch live articles from API
  useEffect(() => {
    fetch("/api/blog")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.posts && data.posts.length > 0) {
          setPosts(data.posts);
        }
      })
      .catch((err) => console.error("Error loading blog posts:", err));
  }, []);

  // Sync with URL Hash (#tag)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#+/, "").trim().toLowerCase();
      if (hash) {
        setSelectedTag(hash);
      } else {
        setSelectedTag("all");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleTagClick = (tag: string) => {
    const cleaned = tag.replace(/^#+/, "").trim().toLowerCase();
    if (selectedTag.toLowerCase() === cleaned) {
      window.location.hash = "";
      setSelectedTag("all");
    } else {
      window.location.hash = cleaned;
      setSelectedTag(cleaned);
    }
  };

  // Extract all unique tags dynamically
  const dynamicTags = Array.from(
    new Set(
      posts.flatMap((p) => (p.tags || []).map((t: string) => t.toLowerCase()))
    )
  );
  const allTags = ["all", ...dynamicTags];

  const filteredPosts = posts.filter((post) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      !term ||
      post.title[locale]?.toLowerCase().includes(term) ||
      post.excerpt?.[locale]?.toLowerCase().includes(term) ||
      post.title.en?.toLowerCase().includes(term) ||
      post.slug?.toLowerCase().includes(term);

    const matchesTag =
      selectedTag === "all" ||
      (post.tags || []).some(
        (t: string) => t.toLowerCase() === selectedTag.toLowerCase()
      ) ||
      post.slug.toLowerCase().includes(selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  const openMediaModal = (mediaList: MediaItem[]) => {
    setActiveMedia(mediaList);
    setModalOpen(true);
  };

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <StatusBadge label="Technical Printing Insights" variant="express" pulsingDot shimmer />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            The GT Printing Blog
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            Essential pre-press guidelines, paper selection advice, bleed rules, and technological breakthroughs for designers, procurement teams, and brand managers.
          </p>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, pre-press guides, bleeds, CMYK..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface border border-border text-foreground text-sm placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {allTags.map((tag) => {
              const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                    isSelected
                      ? "bg-primary text-white shadow-glow-sm"
                      : "bg-surface border border-border text-foreground-muted hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {tag === "all" ? "All Articles" : `#${tag}`}
                </button>
              );
            })}
          </div>

          {/* Active Hashtag Banner */}
          {selectedTag !== "all" && (
            <div className="flex items-center justify-center gap-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-bold shadow-xs">
                <span>Filtering by: #{selectedTag}</span>
                <button
                  type="button"
                  onClick={() => handleTagClick(selectedTag)}
                  className="hover:text-red-500 transition-colors p-0.5"
                  title="Clear hashtag filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const mediaList: MediaItem[] = [
              ...(post.mediaLinks || []).map((ml: any) => ({
                type: ml.type,
                url: ml.url,
                title: ml.title || post.title[locale] || post.title.en,
              })),
              ...(post.galleryImages || []).map((url: string) => ({
                type: "image" as const,
                url,
                title: post.title[locale] || post.title.en,
              })),
            ];

            const hasVideos = (post.mediaLinks || []).some(
              (ml: any) => ml.type === "youtube" || ml.type === "youtube_short" || ml.type === "vimeo"
            );

            return (
              <article
                key={post.slug}
                className="flex flex-col justify-between rounded-3xl bg-surface border border-border overflow-hidden hover:border-primary/40 transition-colors shadow-sm group"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-secondary">
                  <img
                    src={post.coverImage}
                    alt={post.title[locale] || post.title.en}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => {
                      if (mediaList.length > 0) openMediaModal(mediaList);
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-bold uppercase tracking-wider text-primary">
                      {post.categoryLabel?.[locale] || post.categoryLabel?.en || post.category}
                    </span>
                  </div>

                  {/* Play Video Overlay */}
                  {hasVideos && (
                    <button
                      type="button"
                      onClick={() => openMediaModal(mediaList)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-primary/90 hover:bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-xs transition-transform hover:scale-105"
                      title="Watch accompanying video"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Video</span>
                    </button>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-[11px] text-foreground-muted font-mono">
                      <span>{post.publishedDate}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {post.title[locale] || post.title.en}
                    </h2>

                    <p className="text-xs text-foreground-muted line-clamp-3 leading-relaxed">
                      {post.excerpt?.[locale] || post.excerpt?.en}
                    </p>

                    {/* Hashtag Chips */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {post.tags.map((tag: string) => {
                          const cleaned = tag.replace(/^#+/, "").toLowerCase();
                          const isSelected = selectedTag.toLowerCase() === cleaned;
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleTagClick(cleaned);
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
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-1.5 transition-all"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <span className="text-[11px] text-foreground-muted truncate max-w-[120px]">
                      {post.author}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-foreground-muted/40 mx-auto" />
            <h3 className="text-base font-bold text-foreground">No articles match your criteria</h3>
            <p className="text-xs text-foreground-muted">
              Try searching for something else or clearing the hashtag filter.
            </p>
            {selectedTag !== "all" && (
              <button
                type="button"
                onClick={() => handleTagClick("all")}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-glow-sm"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Media Modal */}
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        media={activeMedia}
      />
    </div>
  );
}
