"use server";

import sharp from "sharp";
import { getSession } from "@/lib/auth";
import { execute } from "@/lib/db";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type UploadState = { error?: string; url?: string } | undefined;

/**
 * Accepts an uploaded image, validates it strictly, and re-encodes it
 * through sharp before storing it — this strips EXIF/embedded payloads
 * and normalizes the format regardless of what container the original
 * file claimed to be. Images are stored as rows in the `media` table
 * rather than as files on disk: this app's shared-hosting account gives
 * no strong guarantee about a writable, persistent path across deploys,
 * and at the handful-of-images scale this site needs, the database is
 * simpler to reason about and back up than a filesystem. Because this
 * app has no PHP runtime in its request path at all, "upload a script
 * disguised as an image" (the exact class of attack that compromised
 * the old WordPress site) has no execution path here even without this
 * step — this is defense in depth.
 */
export async function uploadImageAction(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const session = await getSession();
  if (!session) return { error: "Your session has expired. Log in again and retry." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Choose an image to upload." };
  if (file.size === 0) return { error: "Choose an image to upload." };
  if (file.size > MAX_BYTES) return { error: "Image must be smaller than 5MB." };
  if (!ALLOWED_MIME.has(file.type)) {
    return { error: "Only JPEG, PNG, WebP, or GIF images are allowed." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let output: Buffer;
  let width: number | null = null;
  let height: number | null = null;
  try {
    output = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const meta = await sharp(output).metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
  } catch {
    return { error: "That file doesn't look like a valid image." };
  }

  const result = await execute(
    `INSERT INTO media (mime_type, data, width, height, size_bytes) VALUES (?, ?, ?, ?, ?)`,
    ["image/webp", output, width, height, output.length]
  );

  return { url: `/media/${result.insertId}` };
}
