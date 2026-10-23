import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { getSession, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users
 * Administrator-only endpoint to list all users with search, role/status filtering, and stats.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required to manage staff accounts" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const role = searchParams.get("role")?.trim() || "all";
    const status = searchParams.get("status")?.trim() || "all";

    const query: any = {};

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    if (role && role !== "all") {
      query.role = role;
    }

    if (status === "active") {
      query.active = { $ne: false };
    } else if (status === "inactive") {
      query.active = false;
    }

    const [users, allUsers] = await Promise.all([
      User.find(query, { passwordHash: 0 }).sort({ createdAt: -1 }).lean(),
      User.find({}, { role: 1, active: 1 }).lean(),
    ]);

    const stats = {
      total: allUsers.length,
      admins: allUsers.filter((u) => u.role === "admin").length,
      editors: allUsers.filter((u) => u.role === "editor").length,
      active: allUsers.filter((u) => u.active !== false).length,
      inactive: allUsers.filter((u) => u.active === false).length,
    };

    return NextResponse.json({
      success: true,
      users,
      stats,
    });
  } catch (error: any) {
    console.error("[ADMIN USERS GET ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch staff directory" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Administrator-only endpoint to create a new staff account (Admin or Editor).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, role, phone, avatarUrl, active } = body;

    // Validations
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Full Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const assignedRole = role === "admin" ? "admin" : "editor";
    const normalizedEmail = email.toLowerCase().trim();

    await dbConnect();

    // Check email uniqueness
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: "A staff account with this email address already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: assignedRole,
      phone: typeof phone === "string" ? phone.trim() : "",
      avatarUrl: typeof avatarUrl === "string" ? avatarUrl.trim() : "",
      active: active !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          avatarUrl: newUser.avatarUrl,
          active: newUser.active,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[ADMIN USERS POST ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create user account" },
      { status: 500 }
    );
  }
}
