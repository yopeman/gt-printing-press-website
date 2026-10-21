import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    await dbConnect();

    const updated = await BlogPost.findByIdAndUpdate(
      id,
      {
        $set: {
          slug: body.slug,
          coverImage: body.coverImage,
          category: body.category,
          status: body.status,
          publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
          translations: body.translations,
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error("[ADMIN BLOG PUT ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await dbConnect();

    const deleted = await BlogPost.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("[ADMIN BLOG DELETE ERROR]", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
