import React from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BLOG_DATA } from "@/data/blog";
import { type Locale } from "@/types/database";
import { routing } from "@/i18n/routing";
import { dbConnect } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { ArticleJsonLd } from "@/components/seo/json-ld";
import { BlogDetailView } from "@/components/blog/blog-detail-view";

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

export default async function BlogPostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const loc = locale as Locale;

  let post: any = BLOG_DATA.find((p) => p.slug === slug);

  // If not in static data, check MongoDB
  if (!post) {
    try {
      await dbConnect();
      const dbPost = await BlogPost.findOne({ slug, status: "published" }).lean();
      if (dbPost) {
        const cover =
          (dbPost as any).coverImage ||
          "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80";

        post = {
          slug: (dbPost as any).slug,
          category: (dbPost as any).category || "commercial-printing",
          categoryLabel: {
            en: ((dbPost as any).category || "Commercial Printing").replace(/-/g, " "),
            am: ((dbPost as any).category || "የህትመት ቴክኖሎጂ").replace(/-/g, " "),
            om: ((dbPost as any).category || "Teknooloojii Maxxansaa").replace(/-/g, " "),
          },
          title: {
            en: (dbPost as any).translations?.en?.title || (dbPost as any).slug,
            am: (dbPost as any).translations?.am?.title || (dbPost as any).translations?.en?.title || (dbPost as any).slug,
            om: (dbPost as any).translations?.om?.title || (dbPost as any).translations?.en?.title || (dbPost as any).slug,
          },
          excerpt: {
            en: (dbPost as any).translations?.en?.excerpt || "",
            am: (dbPost as any).translations?.am?.excerpt || (dbPost as any).translations?.en?.excerpt || "",
            om: (dbPost as any).translations?.om?.excerpt || (dbPost as any).translations?.en?.excerpt || "",
          },
          content: {
            en: (dbPost as any).translations?.en?.body || "",
            am: (dbPost as any).translations?.am?.body || (dbPost as any).translations?.en?.body || "",
            om: (dbPost as any).translations?.om?.body || (dbPost as any).translations?.en?.body || "",
          },
          author: "GT Technical Pre-Press Team",
          authorRole: "Senior Color Separation & Offset Specialists",
          publishedDate: (dbPost as any).publishedAt
            ? new Date((dbPost as any).publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recently Published",
          readTime: "4 min read",
          coverImage: cover,
          galleryImages: (dbPost as any).galleryUrls || [],
          tags: (dbPost as any).tags || [],
          mediaLinks: (dbPost as any).mediaLinks || [],
        };
      }
    } catch (e) {
      console.error(e);
    }
  }

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
