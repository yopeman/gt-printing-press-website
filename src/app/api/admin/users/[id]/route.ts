import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { getSession, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const user = await User.findById(params.id, { passwordHash: 0 }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("[ADMIN USER GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Administrator-only endpoint to update user profile, role, active status, or reset password.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Administrator role required" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    await dbConnect();

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    const updates: any = {};

    // Safeguards for self-editing
    const isSelf = id === session.userId;

    if (typeof body.name === "string" && body.name.trim().length >= 2) {
      updates.name = body.name.trim();
    }

    if (typeof body.email === "string" && body.email.includes("@")) {
      const normalizedEmail = body.email.toLowerCase().trim();
      if (normalizedEmail !== targetUser.email) {
        const emailTaken = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: targetUser._id },
        });
        if (emailTaken) {
          return NextResponse.json(
            { error: "Another account is already registered with this email" },
            { status: 400 }
          );
        }
        updates.email = normalizedEmail;
      }
    }

    if (body.role && (body.role === "admin" || body.role === "editor")) {
      if (isSelf && body.role !== "admin") {
        return NextResponse.json(
          { error: "You cannot demote your own administrator privileges" },
          { status: 400 }
        );
      }
      updates.role = body.role;
    }

    if (typeof body.active === "boolean") {
      if (isSelf && body.active === false) {
        return NextResponse.json(
          { error: "You cannot deactivate your own account" },
          { status: 400 }
        );
      }
      updates.active = body.active;
    }

    if (typeof body.phone === "string") {
      updates.phone = body.phone.trim();
    }

    if (typeof body.avatarUrl === "string") {
      updates.avatarUrl = body.avatarUrl.trim();
    }

    // Optional password reset
    if (typeof body.password === "string" && body.password.length > 0) {
      if (body.password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      updates.passwordHash = await hashPassword(body.password);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, projection: { passwordHash: 0 } }
    );

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("[ADMIN USER PATCH ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update staff member" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Administrator-only endpoint to delete a staff account.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Administrator role required" }, { status: 403 });
    }

    const { id } = params;

    // Guard: Prevent deleting own account
    if (id === session.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own active administrator account" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Guard: Ensure system retains at least one active administrator
    const adminCount = await User.countDocuments({ role: "admin" });
    const targetUser = await User.findById(id);

    if (!targetUser) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    if (targetUser.role === "admin" && adminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last remaining administrator account" },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Account for ${targetUser.name} deleted successfully`,
    });
  } catch (error: any) {
    console.error("[ADMIN USER DELETE ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete account" },
      { status: 500 }
    );
  }
}
