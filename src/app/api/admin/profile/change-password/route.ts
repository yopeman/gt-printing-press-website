import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { getSession, hashPassword, comparePassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/profile/change-password
 * Allows the currently logged-in user to change their account password securely.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || typeof currentPassword !== "string") {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findById(session.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "The current password you entered is incorrect" },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    user.passwordHash = newHash;
    user.updatedAt = new Date();
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password changed successfully. Please remember to use your new password next time you sign in.",
    });
  } catch (error: any) {
    console.error("[ADMIN CHANGE PASSWORD ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to change password" },
      { status: 500 }
    );
  }
}
