import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import QuoteRequest from "@/models/QuoteRequest";
import { getSession } from "@/lib/auth";

export async function PATCH(
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

    const allowedUpdates: any = {};
    if (body.status) {
      allowedUpdates.status = body.status;
    }
    if (typeof body.internalNotes === "string") {
      allowedUpdates.notes = body.internalNotes;
    } else if (typeof body.notes === "string") {
      allowedUpdates.notes = body.notes;
    }

    const updated = await QuoteRequest.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, quote: updated });
  } catch (error: any) {
    console.error("[ADMIN QUOTE PATCH ERROR]", error);
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 });
  }
}
