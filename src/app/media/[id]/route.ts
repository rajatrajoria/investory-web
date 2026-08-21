import { queryOne } from "@/lib/db";

// Each id is immutable once written — replacing an image inserts a new
// row with a new id rather than overwriting one in place — so a cached
// response for a given id can be cached "forever" without ever going stale.
const CACHE_HEADERS = { "Cache-Control": "public, max-age=31536000, immutable" };

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mediaId = Number(id);
  if (!Number.isInteger(mediaId) || mediaId <= 0) {
    return new Response("Not found", { status: 404 });
  }

  const row = await queryOne<{ mime_type: string; data: Buffer }>(
    `SELECT mime_type, data FROM media WHERE id = ?`,
    [mediaId]
  );
  if (!row) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });

  return new Response(new Uint8Array(row.data), {
    headers: { "Content-Type": row.mime_type, ...CACHE_HEADERS },
  });
}
