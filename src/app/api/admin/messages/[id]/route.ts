import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const message = await ContactMessage.findById(params.id).lean();

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error("[ADMIN MESSAGE GET BY ID ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const allowedUpdates: any = {};
    if (body.status) allowedUpdates.status = body.status;
    if (typeof body.notes !== "undefined") allowedUpdates.notes = body.notes;

    const updated = await ContactMessage.findByIdAndUpdate(
      params.id,
      { $set: allowedUpdates },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error: any) {
    console.error("[ADMIN MESSAGE PATCH ERROR]", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 403 });
    }

    await dbConnect();
    const deleted = await ContactMessage.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error: any) {
    console.error("[ADMIN MESSAGE DELETE ERROR]", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
