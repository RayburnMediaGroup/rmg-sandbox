import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const MAX_BYTES = 1 * 1024 * 1024; // 1MB
const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

function buildWatermarkSvg(text: string, width: number, height: number): Buffer {
  const fontSize = Math.round(Math.min(width, height) * 0.045);
  const diag = Math.sqrt(width * width + height * height);
  // Repeat text across a wide strip rotated 30°
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

    // Get image dimensions before compositing
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

    if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
    await writeFile(join(UPLOAD_DIR, filename), webpBuffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      size: webpBuffer.length,
      originalSize: file.size,
      watermarked: watermark,
    });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
