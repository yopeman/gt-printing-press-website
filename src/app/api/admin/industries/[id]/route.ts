import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Industry from "@/models/Industry";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const industry = await Industry.findById(params.id).lean();
    if (!industry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json({ industry });
  } catch (error: any) {
    console.error("[ADMIN INDUSTRY GET BY ID ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch industry" }, { status: 500 });
  }
}

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

    const updated = await Industry.findByIdAndUpdate(
      id,
      {
        $set: {
          slug: body.slug,
          icon: body.icon,
          image: body.image,
          galleryUrls: body.galleryUrls || [],
          mediaLinks: body.mediaLinks || [],
          order: body.order,
          active: body.active,
          translations: body.translations,
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, industry: updated });
  } catch (error: any) {
    console.error("[ADMIN INDUSTRY PUT ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to update industry" }, { status: 500 });
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

    const deleted = await Industry.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Industry deleted successfully" });
  } catch (error: any) {
    console.error("[ADMIN INDUSTRY DELETE ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to delete industry" }, { status: 500 });
  }
}
