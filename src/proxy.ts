import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Middleware runs on the Edge runtime, so it can only do lightweight,
// dependency-free checks (JWT signature verification via `jose`) — DB-backed
// rate limiting and full auth logic live in the Node.js API routes instead.

const PROTECTED_PREFIX = "/studio";
const LOGIN_PATH = "/studio/login";

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("investory_session")?.value;
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith(PROTECTED_PREFIX) && pathname !== LOGIN_PATH) {
    const ok = await hasValidSession(req);
    if (!ok) {
      const loginUrl = new URL(LOGIN_PATH, req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*"],
};
