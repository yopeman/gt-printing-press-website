"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { type Locale } from "@/types/database";
import { MediaModal, MediaItem } from "@/components/ui";
import { MarkdownContent } from "@/components/blog/markdown-content";
import {
  ArrowRight,
  ChevronLeft,
  Clock,
  Calendar,
  Tag,
  Play,
  Film,
  Video,
  Share2,
} from "lucide-react";

interface BlogDetailViewProps {
  post: any;
  locale: Locale;
  relatedPosts: any[];
}

export function BlogDetailView({ post, locale, relatedPosts }: BlogDetailViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<MediaItem[] | null>(null);

  const mediaList: MediaItem[] = [
    ...(post.mediaLinks || []).map((ml: any) => ({
      type: ml.type,
      url: ml.url,
      title: ml.title || post.title[locale] || post.title.en,
    })),
    ...(post.galleryImages || []).map((url: string, idx: number) => ({
      type: "image" as const,
      url,
      title: `${post.title[locale] || post.title.en} - Image ${idx + 1}`,
    })),
  ];

  const hasVideos = (post.mediaLinks || []).some(
    (ml: any) => ml.type === "youtube" || ml.type === "youtube_short" || ml.type === "vimeo"
  );

  const openModal = (items: MediaItem[]) => {
    setActiveMedia(items);
    setModalOpen(true);
  };

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10 max-w-4xl">
      {/* Back Link */}
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground-muted">
        <Link
          href="/blog"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Articles</span>
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-sm">
          {post.title[locale] || post.title.en}
        </span>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold font-mono text-primary uppercase">
            {post.categoryLabel?.[locale] || post.categoryLabel?.en || post.category}
          </span>
          <span className="text-xs text-foreground-muted flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {post.publishedDate}
          </span>
          <span className="text-xs text-foreground-muted flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
          {post.title[locale] || post.title.en}
        </h1>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full bg-surface-secondary border border-border flex items-center justify-center font-bold text-sm text-primary">
            {post.author.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">{post.author}</div>
            <div className="text-xs text-foreground-muted">{post.authorRole}</div>
          </div>
        </div>
      </div>

      {/* Cover Image with Media Play Option */}
      <div className="relative rounded-3xl overflow-hidden border border-border aspect-[16/9] bg-surface-secondary shadow-card-glass group">
        <img
          src={post.coverImage}
          alt={post.title[locale] || post.title.en}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => {
            if (mediaList.length > 0) openModal(mediaList);
          }}
        />

        {hasVideos && (
          <button
            type="button"
            onClick={() => openModal(mediaList)}
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Watch Accompanying Video</span>
          </button>
        )}
      </div>

      {/* Embedded Media Showcase if links exist */}
      {post.mediaLinks && post.mediaLinks.length > 0 && (
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-card-glass space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" />
            <span>Interactive Media & Video Clips</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {post.mediaLinks.map((ml: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => openModal([ml])}
                className="flex items-center gap-3 p-3 rounded-2xl bg-surface-secondary hover:bg-surface-secondary/80 border border-border hover:border-primary/40 text-left transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-foreground truncate">
                    {ml.title || `${ml.type.replace("_", " ")} clip`}
                  </div>
                  <div className="text-[11px] text-foreground-muted font-mono truncate">
                    Click to play in modal
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Body Content with Full Markdown Support */}
      <div className="pt-2">
        <MarkdownContent content={post.content?.[locale] || post.content?.en || ""} />
      </div>

      {/* Tags with direct link to hashtag filter */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-border flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-foreground-muted mr-1" />
          {post.tags.map((tag: string) => {
            const cleaned = tag.replace(/^#+/, "").toLowerCase();
            return (
              <Link
                key={tag}
                href={`/blog#${cleaned}`}
                className="px-3 py-1 rounded-full bg-surface border border-border hover:border-primary/40 hover:text-primary text-xs font-semibold text-foreground-muted font-mono transition-colors"
              >
                #{cleaned}
              </Link>
            );
          })}
        </div>
      )}

      {/* Inline Quote CTA Card */}
      <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          Have Questions About Print Specifications?
        </h3>
        <p className="text-xs sm:text-sm text-foreground-muted max-w-lg mx-auto">
          Our pre-press technicians are available to review your vector files, bleeds, and color profiles prior to production.
        </p>
        <div className="pt-2">
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-glow-sm transition-all"
          >
            <span>Request Free File Check & Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-border">
          <h3 className="text-xl font-bold text-foreground">Related Technical Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((r: any) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-colors flex items-center gap-4 group"
              >
                <img
                  src={r.coverImage}
                  alt={r.title[locale] || r.title.en}
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                    {r.categoryLabel?.[locale] || r.categoryLabel?.en || r.category}
                  </span>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {r.title[locale] || r.title.en}
                  </h4>
                  <span className="text-xs text-foreground-muted mt-1 block font-mono">
                    {r.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Media Modal Player */}
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        media={activeMedia}
      />
    </article>
  );
}
