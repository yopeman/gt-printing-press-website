import React from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/types/database";
import { routing } from "@/i18n/routing";
import { getDbBlogPostBySlug, getDbRelatedBlogPosts, getDbBlogPosts } from "@/lib/data-service";
import { ArticleJsonLd } from "@/components/seo/json-ld";
import { BlogDetailView } from "@/components/blog/blog-detail-view";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  try {
    const posts = await getDbBlogPosts();
    for (const locale of routing.locales) {
      for (const post of posts) {
        params.push({
          locale,
          slug: post.slug,
        });
      }
    }
  } catch (err) {
    console.error("Error in generateStaticParams for blog:", err);
  }

  return params;
}

export default async function BlogPostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  // Query MongoDB first via data service
  const post = await getDbBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch real related posts from DB
  const relatedPosts = await getDbRelatedBlogPosts(slug, 2);

  return (
    <div className="relative overflow-hidden py-10 md:py-16">
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[130px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <ArticleJsonLd
        title={post.title[loc] || post.title.en}
        description={post.excerpt[loc] || post.excerpt.en}
        slug={post.slug}
        publishedDate={post.publishedDate}
        coverImage={post.coverImage}
        author={post.author}
      />
      <BlogDetailView post={post} locale={loc} relatedPosts={relatedPosts} />
    </div>
  );
}
