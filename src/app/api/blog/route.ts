import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { BLOG_DATA } from "@/data/blog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const dbPosts = await BlogPost.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    if (!dbPosts || dbPosts.length === 0) {
      return NextResponse.json({ posts: BLOG_DATA });
    }

    const formattedDb = dbPosts.map((p: any) => {
      const cover =
        p.coverImage ||
        "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80";

      return {
        slug: p.slug,
        category: p.category || "commercial-printing",
        categoryLabel: {
          en: (p.category || "Commercial Printing").replace(/-/g, " "),
          am: (p.category || "የህትመት ቴክኖሎጂ").replace(/-/g, " "),
          om: (p.category || "Teknooloojii Maxxansaa").replace(/-/g, " "),
        },
        title: {
          en: p.translations?.en?.title || p.slug,
          am: p.translations?.am?.title || p.translations?.en?.title || p.slug,
          om: p.translations?.om?.title || p.translations?.en?.title || p.slug,
        },
        excerpt: {
          en: p.translations?.en?.excerpt || "",
          am: p.translations?.am?.excerpt || p.translations?.en?.excerpt || "",
          om: p.translations?.om?.excerpt || p.translations?.en?.excerpt || "",
        },
        content: {
          en: p.translations?.en?.body || "",
          am: p.translations?.am?.body || p.translations?.en?.body || "",
          om: p.translations?.om?.body || p.translations?.en?.body || "",
        },
        author: "GT Technical Pre-Press Team",
        authorRole: "Senior Color Separation & Offset Specialists",
        publishedDate: p.publishedAt
          ? new Date(p.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently Published",
        readTime: "4 min read",
        coverImage: cover,
        galleryImages: p.galleryUrls || [],
        tags: p.tags || [],
        mediaLinks: p.mediaLinks || [],
      };
    });

    return NextResponse.json({ posts: formattedDb });
  } catch (err: any) {
    console.error("[PUBLIC BLOG GET ERROR]", err);
    return NextResponse.json({ posts: BLOG_DATA });
  }
}
