import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { getSession } from "@/lib/auth";
import { BLOG_DATA } from "@/data/blog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Auto-seed if database collection is empty
    const count = await BlogPost.countDocuments();
    if (count === 0 && BLOG_DATA.length > 0) {
      const seedItems = BLOG_DATA.map((item) => ({
        slug: item.slug,
        coverImage: item.coverImage,
        category: item.category,
        status: "published",
        publishedAt: new Date(item.publishedDate || Date.now()),
        translations: {
          en: {
            title: item.title.en,
            excerpt: item.excerpt.en,
            body: item.content.en,
            seoTitle: item.title.en,
            seoDescription: item.excerpt.en,
          },
          am: {
            title: item.title.am || item.title.en,
            excerpt: item.excerpt.am || item.excerpt.en,
            body: item.content.am || item.content.en,
            seoTitle: item.title.am || item.title.en,
            seoDescription: item.excerpt.am || item.excerpt.en,
          },
          om: {
            title: item.title.om || item.title.en,
            excerpt: item.excerpt.om || item.excerpt.en,
            body: item.content.om || item.content.en,
            seoTitle: item.title.om || item.title.en,
            seoDescription: item.excerpt.om || item.excerpt.en,
          },
        },
      }));

      await BlogPost.insertMany(seedItems);
    }

    const posts = await BlogPost.find().sort({ publishedAt: -1 }).lean();
    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error("[ADMIN BLOG GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    if (!body.slug || !body.translations?.en?.title || !body.translations?.en?.body) {
      return NextResponse.json(
        { error: "Slug and English title/body are required" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await BlogPost.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { error: "A post with this URL slug already exists" },
        { status: 409 }
      );
    }

    const newPost = await BlogPost.create({
      slug: body.slug,
      coverImage: body.coverImage || "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80",
      galleryUrls: body.galleryUrls || [],
      category: body.category || "commercial-printing",
      tags: body.tags || [],
      mediaLinks: body.mediaLinks || [],
      status: body.status || "draft",
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      translations: {
        en: {
          title: body.translations.en.title,
          excerpt: body.translations.en.excerpt || "",
          body: body.translations.en.body,
          seoTitle: body.translations.en.seoTitle || body.translations.en.title,
          seoDescription: body.translations.en.seoDescription || body.translations.en.excerpt || "",
        },
        am: {
          title: body.translations?.am?.title || body.translations.en.title,
          excerpt: body.translations?.am?.excerpt || body.translations.en.excerpt || "",
          body: body.translations?.am?.body || body.translations.en.body,
          seoTitle: body.translations?.am?.seoTitle || "",
          seoDescription: body.translations?.am?.seoDescription || "",
        },
        om: {
          title: body.translations?.om?.title || body.translations.en.title,
          excerpt: body.translations?.om?.excerpt || body.translations.en.excerpt || "",
          body: body.translations?.om?.body || body.translations.en.body,
          seoTitle: body.translations?.om?.seoTitle || "",
          seoDescription: body.translations?.om?.seoDescription || "",
        },
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error("[ADMIN BLOG POST ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to create post" }, { status: 500 });
  }
}
