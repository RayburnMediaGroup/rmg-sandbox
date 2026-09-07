import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const MAX_BYTES = 1 * 1024 * 1024; // 1MB

function buildWatermarkSvg(text: string, width: number, height: number): Buffer {
  const fontSize = Math.round(Math.min(width, height) * 0.045);
  const diag = Math.sqrt(width * width + height * height);
  const repeat = Math.ceil(diag / (text.length * fontSize * 0.6)) + 2;
  const textRow = Array(repeat).fill(text).join("   ·   ");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <style>
        text {
          font-family: Arial, sans-serif;
          font-size: ${fontSize}px;
          font-weight: 600;
          fill: rgba(255,255,255,0.18);
          letter-spacing: 0.08em;
        }
      </style>
      <g transform="rotate(-30 ${width / 2} ${height / 2})">
        <text x="${-diag}" y="${height * 0.35}">${textRow}</text>
        <text x="${-diag}" y="${height * 0.55}">${textRow}</text>
        <text x="${-diag}" y="${height * 0.75}">${textRow}</text>
      </g>
    </svg>`;
  return Buffer.from(svg);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const watermark = formData.get("watermark") === "true";
    const watermarkText = (formData.get("watermarkText") as string | null) ?? "Photographer";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "File exceeds 1MB limit" }, { status: 400 });

    const mimeOk = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"].includes(file.type);
    if (!mimeOk) return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const meta = await sharp(buffer).metadata();
    const width = meta.width ?? 1200;
    const height = meta.height ?? 900;

    let pipeline = sharp(buffer).webp({ quality: 82 });

    if (watermark) {
      const wmSvg = buildWatermarkSvg(watermarkText.trim() || "Photographer", width, height);
      pipeline = sharp(buffer)
        .composite([{ input: wmSvg, top: 0, left: 0 }])
        .webp({ quality: 82 });
    }

    const webpBuffer = await pipeline.toBuffer();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;

    // Upload to Supabase Storage instead of local filesystem
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(filename, webpBuffer, { contentType: "image/webp", upsert: false });

    if (uploadError) {
      console.error("[upload] Supabase storage error:", uploadError);
      return NextResponse.json({ error: "Storage upload failed" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(filename);

    return NextResponse.json({
      url: publicUrl,
      size: webpBuffer.length,
      originalSize: file.size,
      watermarked: watermark,
    });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
