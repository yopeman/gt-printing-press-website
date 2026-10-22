"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { BLOG_DATA } from "@/data/blog";
import { type Locale } from "@/types/database";
import { StatusBadge } from "@/components/ui";
import { LiveLocationMap } from "@/components/blog/live-location-map";
import { Search, Clock, ArrowRight, BookOpen, Tag } from "lucide-react";

export default function BlogListPage() {
  const locale = useLocale() as Locale;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const allTags = ["all", "Prepress", "CMYK", "Packaging", "Finishing", "Artificial Intelligence"];

  const filteredPosts = BLOG_DATA.filter((post) => {
    const matchesSearch =
      post.title[locale]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt[locale]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.title.en.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === "all" || post.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
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
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedTag === tag
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface border border-border text-foreground-muted hover:text-foreground"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col justify-between rounded-3xl bg-surface border border-border overflow-hidden hover:border-primary/40 transition-colors shadow-sm group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-secondary">
                <img
                  src={post.coverImage}
                  alt={post.title[locale] || post.title.en}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-bold uppercase tracking-wider text-primary">
                    {post.categoryLabel[locale] || post.categoryLabel.en}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
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
                    {post.excerpt[locale] || post.excerpt.en}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-1.5 transition-all"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <span className="text-[11px] text-foreground-muted">
                    {post.author}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Live Location Map with Fullscreen Mode */}
        <LiveLocationMap />
      </div>
    </div>
  );
}
