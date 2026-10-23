import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Service from "@/models/Service";
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
    const service = await Service.findById(params.id).lean();
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error: any) {
    console.error("[ADMIN SERVICE GET BY ID ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
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

    const updated = await Service.findByIdAndUpdate(
      id,
      {
        $set: {
          slug: body.slug,
          glyph: body.glyph,
          coverImage: body.coverImage,
          galleryUrls: body.galleryUrls,
          equipmentUsed: body.equipmentUsed || [],
          mediaLinks: body.mediaLinks || [],
          order: body.order,
          featured: body.featured,
          active: body.active,
          translations: body.translations,
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    console.error("[ADMIN SERVICE PUT ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to update service" }, { status: 500 });
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

    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error: any) {
    console.error("[ADMIN SERVICE DELETE ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to delete service" }, { status: 500 });
  }
}
