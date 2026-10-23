import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "gt-printing-press-jwt-production-secret-2026-secure-key"
);

export const COOKIE_NAME = "gt_admin_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  avatarUrl?: string;
  exp?: number;
}

/**
 * Sign JWT for admin session (7 days expiry)
 */
export async function signSession(payload: Omit<SessionPayload, "exp">): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verify JWT token string
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Get current session from server-side cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Verify session directly from NextRequest (for middleware and edge-compatible handlers)
 */
export async function getRequestSession(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

/**
 * Compare password with hash
 */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Auto-seed default administrative user if none exists in database
 */
export async function ensureDefaultAdmin(): Promise<void> {
  await dbConnect();
  const count = await User.countDocuments();
  if (count === 0) {
    const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@gtprintingpress.com";
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "gtadmin2026!";
    const passwordHash = await hashPassword(defaultPassword);

    await User.create({
      name: "GT System Administrator",
      email: defaultEmail,
      passwordHash,
      role: "admin",
    });
    console.log(`[AUTH SEED] Initialized default admin account: ${defaultEmail}`);
  }
}
