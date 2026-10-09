import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Demo: geen loginvereiste. Middleware alleen voor eventuele toekomstige headers. */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
