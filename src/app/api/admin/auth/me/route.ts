import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const userDoc = await User.findById(session.userId).lean();
    if (userDoc) {
      return NextResponse.json({
        user: {
          userId: userDoc._id.toString(),
          email: userDoc.email,
          name: userDoc.name,
          role: userDoc.role,
          phone: userDoc.phone || "",
          avatarUrl: userDoc.avatarUrl || "",
          active: userDoc.active !== false,
          lastLogin: userDoc.lastLogin,
          createdAt: userDoc.createdAt,
        },
      });
    }
  } catch (_) {}

  return NextResponse.json({
    user: {
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      avatarUrl: session.avatarUrl || "",
    },
  });
}
