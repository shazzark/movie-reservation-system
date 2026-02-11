// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
  req: NextRequest,
  _context: { params: Promise<Record<string, string>> },
) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // --- FIX HERE: Define the return type of the promise ---
  return new Promise<NextResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "movie_posters" }, (error, result) => {
        if (error) {
          reject(
            NextResponse.json({ error: "Upload failed" }, { status: 500 }),
          );
          return;
        }
        resolve(NextResponse.json({ url: result?.secure_url }));
      })
      .end(buffer);
  });
}
