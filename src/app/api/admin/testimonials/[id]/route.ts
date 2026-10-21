import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Testimonial from "@/models/Testimonial";
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

    const updated = await Testimonial.findByIdAndUpdate(
      id,
      {
        $set: {
          clientName: body.clientName,
          role: body.role,
          company: body.company,
          avatarUrl: body.avatarUrl,
          order: body.order,
          published: body.published,
          translations: body.translations,
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: any) {
    console.error("[ADMIN TESTIMONIAL PUT ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to update testimonial" }, { status: 500 });
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

    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error: any) {
    console.error("[ADMIN TESTIMONIAL DELETE ERROR]", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
