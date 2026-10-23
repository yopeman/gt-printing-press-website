import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Capability from "@/models/Capability";
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
    const capability = await Capability.findById(params.id).lean();
    if (!capability) {
      return NextResponse.json({ error: "Machine not found" }, { status: 404 });
    }

    return NextResponse.json({ capability });
  } catch (error: any) {
    console.error("[ADMIN CAPABILITY GET BY ID ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch machine" }, { status: 500 });
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

    const updated = await Capability.findByIdAndUpdate(
      id,
      {
        $set: {
          name: body.name,
          slug: body.slug,
          category: body.category,
          manufacturer: body.manufacturer,
          origin: body.origin,
          keySpecs: body.keySpecs || [],
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
      return NextResponse.json({ error: "Machine not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, capability: updated });
  } catch (error: any) {
    console.error("[ADMIN CAPABILITY PUT ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to update machine" }, { status: 500 });
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

    const deleted = await Capability.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Machine not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Machine deleted successfully" });
  } catch (error: any) {
    console.error("[ADMIN CAPABILITY DELETE ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to delete machine" }, { status: 500 });
  }
}
