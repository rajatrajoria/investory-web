"use server";

import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export type UploadState = { error?: string; url?: string } | undefined;

/**
 * Accepts an uploaded image, validates it strictly, and re-encodes it
 * through sharp before writing to disk — this strips EXIF/embedded
 * payloads and normalizes the format regardless of what container the
 * original file claimed to be. Because this app has no PHP runtime in its
 * request path at all, "upload a script disguised as an image" (the exact
 * class of attack that compromised the old WordPress site) has no
 * execution path here even without this step — this is defense in depth.
 */
export async function uploadImageAction(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const session = await getSession();
  if (!session) redirect("/studio/login");

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Choose an image to upload." };
  if (file.size === 0) return { error: "Choose an image to upload." };
  if (file.size > MAX_BYTES) return { error: "Image must be smaller than 5MB." };
  if (!ALLOWED_MIME.has(file.type)) {
    return { error: "Only JPEG, PNG, WebP, or GIF images are allowed." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let output: Buffer;
  try {
    output = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return { error: "That file doesn't look like a valid image." };
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.webp`;
  await writeFile(path.join(UPLOAD_DIR, filename), output);

  return { url: `/uploads/${filename}` };
}
