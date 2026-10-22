import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

function getCloudinaryClient() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudinaryUrl) {
    cloudinary.config({ url: cloudinaryUrl });
    return cloudinary;
  }

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return cloudinary;
  }

  return null;
}

async function uploadToCloudinary(
  client: typeof cloudinary,
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const ext = path.extname(fileName) || ".jpg";
  const cleanName = path
    .basename(fileName, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const publicId = `${Date.now()}-${Math.floor(Math.random() * 10000)}-${cleanName}`;

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder: "gt-printing-press",
        public_id: publicId,
        resource_type: "auto",
        overwrite: false,
      },
      (error: any, result: any) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
        } else {
          resolve(result.secure_url || result.url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

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

    const cloudinaryClient = getCloudinaryClient();
    const isCloudinary = Boolean(cloudinaryClient);

    let uploadDir = "";
    if (!isCloudinary) {
      uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
    }

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

      // Max size: 50MB per image
      if (file.size > 50 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 50MB limit.` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      if (isCloudinary && cloudinaryClient) {
        const secureUrl = await uploadToCloudinary(cloudinaryClient, buffer, file.name);
        uploadedUrls.push(secureUrl);
      } else {
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
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length,
      storage: isCloudinary ? "cloudinary" : "local",
    });
  } catch (error: any) {
    console.error("[IMAGE UPLOAD ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
