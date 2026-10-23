import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { getSession, signSession, COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/profile
 * Returns the currently authenticated administrator/staff member profile.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.userId, { passwordHash: 0 }).lean();

    if (!user) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: user,
    });
  } catch (error: any) {
    console.error("[ADMIN PROFILE GET ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load profile" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/profile
 * Allows the current logged-in user to update their own personal profile details
 * (name, email, phone, avatarUrl) and refreshes their session token.
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, avatarUrl } = body;

    await dbConnect();
    const currentUser = await User.findById(session.userId);

    if (!currentUser) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const updates: any = {};

    if (typeof name === "string") {
      if (name.trim().length < 2) {
        return NextResponse.json(
          { error: "Full Name must be at least 2 characters" },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (typeof email === "string" && email.includes("@")) {
      const normalizedEmail = email.toLowerCase().trim();
      if (normalizedEmail !== currentUser.email) {
        const existing = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: currentUser._id },
        });
        if (existing) {
          return NextResponse.json(
            { error: "This email address is already in use by another account" },
            { status: 400 }
          );
        }
        updates.email = normalizedEmail;
      }
    }

    if (typeof phone === "string") {
      updates.phone = phone.trim();
    }

    if (typeof avatarUrl === "string") {
      updates.avatarUrl = avatarUrl.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      { $set: updates },
      { new: true, projection: { passwordHash: 0 } }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    // Re-sign session cookie so the layout and other pages see the new name/email/avatar immediately
    const newToken = await signSession({
      userId: updatedUser._id.toString(),
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      avatarUrl: updatedUser.avatarUrl || "",
    });

    const response = NextResponse.json({
      success: true,
      profile: updatedUser,
      message: "Profile updated successfully",
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("[ADMIN PROFILE PATCH ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
