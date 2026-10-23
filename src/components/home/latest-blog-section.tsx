"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { type Locale } from "@/types/database";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

export function LatestBlogSection() {
  const locale = useLocale() as Locale;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.posts && data.posts.length > 0) {
          setPosts(data.posts.slice(0, 3));
        }
      })
      .catch((err) => console.error("Error loading latest posts:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-surface border border-border overflow-hidden animate-pulse flex flex-col justify-between"
            >
              <div className="aspect-[16/9] bg-surface-secondary/70" />
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
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => {
            const locTitle = post.title?.[locale] || post.title?.en || post.slug;
            const locCat = post.categoryLabel?.[locale] || post.categoryLabel?.en || post.category;
            const locExcerpt = post.excerpt?.[locale] || post.excerpt?.en || "";
            const authorShort = post.author ? post.author.split(" ")[0] : "GT";

            return (
              <article
                key={post.slug}
                className="flex flex-col justify-between rounded-3xl bg-surface border border-border overflow-hidden hover:border-primary/40 transition-colors shadow-sm group"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-surface-secondary">
                  <img
                    src={post.coverImage}
                    alt={locTitle}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-bold uppercase tracking-wider text-primary">
                      {locCat}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
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

                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
                      {locTitle}
                    </h3>

                    <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                      {locExcerpt}
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

                    <span className="text-[11px] text-foreground-muted truncate max-w-[130px]">
                      By {authorShort}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-foreground-muted">
          No blog articles published yet.
        </div>
      )}

      <div className="text-center pt-2">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface hover:bg-surface-secondary border border-border text-xs sm:text-sm font-bold text-foreground transition-colors shadow-sm"
        >
          <BookOpen className="w-4 h-4 text-primary" />
          <span>Browse All Technical Guides & Articles</span>
        </Link>
      </div>
    </div>
  );
}
