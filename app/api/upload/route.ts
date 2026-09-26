// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { withAdmin } from "@/lib/adminHandler";
import { detectSafeImageMime } from "@/lib/image-upload-validation";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_MULTIPART_SIZE = MAX_IMAGE_SIZE + 64 * 1024;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = withAdmin(async (req: NextRequest) => {
  if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json({ error: "Image upload is not configured." }, { status: 503 });
  }
  const contentLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_MULTIPART_SIZE) {
    return NextResponse.json({ error: "Upload an image smaller than 8 MB." }, { status: 413 });
  }
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "Upload an image smaller than 8 MB." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const verifiedMime = detectSafeImageMime(buffer, file.type);
  if (!verifiedMime) {
    return NextResponse.json({ error: "Choose a valid JPEG, PNG, GIF, or WebP image." }, { status: 415 });
  }

  return new Promise<NextResponse>((resolve) => {
    cloudinary.uploader
      .upload_stream({ folder: "movie_posters", resource_type: "image", format: verifiedMime.split("/")[1] === "jpeg" ? "jpg" : verifiedMime.split("/")[1] }, (error, result) => {
        if (error) {
          resolve(NextResponse.json({ error: "Image upload failed." }, { status: 502 }));
          return;
        }
        resolve(NextResponse.json({ url: result?.secure_url }));
      })
      .end(buffer);
  });
});
