import React from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { BLOG_DATA } from "@/data/blog";
import { type Locale } from "@/types/database";
import { routing } from "@/i18n/routing";
import {
  ArrowRight,
  ChevronLeft,
  Clock,
  Calendar,
  User,
  Share2,
  Tag,
  BookOpen,
} from "lucide-react";
import { MarkdownContent } from "@/components/blog/markdown-content";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    for (const post of BLOG_DATA) {
      params.push({
        locale,
        slug: post.slug,
      });
    }
  }

  return params;
}

export default function BlogPostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  const post = BLOG_DATA.find((p) => p.slug === slug);
  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_DATA.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="relative overflow-hidden py-10 md:py-16">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[130px] pointer-events-none -z-10"
        aria-hidden="true"
      />

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
            {post.title[loc] || post.title.en}
          </span>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold font-mono text-primary uppercase">
              {post.categoryLabel[loc] || post.categoryLabel.en}
            </span>
            <span className="text-xs text-foreground-muted flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {post.publishedDate}
            </span>
            <span className="text-xs text-foreground-muted flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
            {post.title[loc] || post.title.en}
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

        {/* Cover Image */}
        <div className="rounded-3xl overflow-hidden border border-border aspect-[16/9] bg-surface-secondary shadow-card-glass">
          <img
            src={post.coverImage}
            alt={post.title[loc] || post.title.en}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body Content with Full Markdown Support */}
        <div className="pt-2">
          <MarkdownContent content={post.content[loc] || post.content.en} />
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-border flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-foreground-muted mr-1" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-foreground-muted font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>

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
              {relatedPosts.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-colors flex items-center gap-4 group"
                >
                  <img
                    src={r.coverImage}
                    alt={r.title[loc] || r.title.en}
                    loading="lazy"
                    decoding="async"
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      {r.categoryLabel[loc] || r.categoryLabel.en}
                    </span>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {r.title[loc] || r.title.en}
                    </h4>
                    <span className="text-xs text-foreground-muted mt-1 block">
                      {r.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
