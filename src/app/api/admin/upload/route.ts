import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const allFiles: File[] = [];
    if (singleFile && singleFile.size > 0) {
      allFiles.push(singleFile);
    }
    if (files && files.length > 0) {
      files.forEach((f) => {
        if (f && f.size > 0 && !allFiles.includes(f)) {
          allFiles.push(f);
        }
      });
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ error: "No image files provided" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of allFiles) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}. Please upload JPEG, PNG, WebP, GIF, or SVG.` },
          { status: 400 }
        );
      }

      // Max size: 10MB per image
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 10MB limit.` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".jpg";
      const cleanName = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 30);
      const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 10000)}-${cleanName}${ext}`;
      const destination = path.join(uploadDir, uniqueName);

      await fs.writeFile(destination, buffer);
      uploadedUrls.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error: any) {
    console.error("[IMAGE UPLOAD ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
