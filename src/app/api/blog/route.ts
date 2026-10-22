import { NextResponse } from "next/server";
import { getDbBlogPosts } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getDbBlogPosts();
    return NextResponse.json({ posts });
  } catch (err: any) {
    console.error("[PUBLIC BLOG GET ERROR]", err);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
