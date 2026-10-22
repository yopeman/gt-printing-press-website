"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { BLOG_DATA } from "@/data/blog";
import { type Locale } from "@/types/database";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

export function LatestBlogSection() {
  const locale = useLocale() as Locale;
  const posts = BLOG_DATA.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col justify-between rounded-3xl bg-surface border border-border overflow-hidden hover:border-primary/40 transition-colors shadow-sm group"
          >
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-secondary">
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

                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {post.title[locale] || post.title.en}
                </h3>

                <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
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

                <span className="text-[11px] text-foreground-muted truncate max-w-[130px]">
                  By {post.author.split(" ")[0]}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

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
