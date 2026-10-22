import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import PortfolioProject from "@/models/PortfolioProject";
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

    const updated = await PortfolioProject.findByIdAndUpdate(
      id,
      {
        $set: {
          slug: body.slug,
          serviceType: body.serviceType,
          industry: body.industry,
          year: body.year,
          featured: body.featured,
          order: body.order,
          galleryUrls: body.galleryUrls,
          tags: body.tags || [],
          mediaLinks: body.mediaLinks || [],
          translations: body.translations,
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    console.error("[ADMIN PORTFOLIO PUT ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 });
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

    const deleted = await PortfolioProject.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("[ADMIN PORTFOLIO DELETE ERROR]", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
