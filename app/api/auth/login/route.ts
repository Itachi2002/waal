import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import {
  checkLoginRateLimit,
  recordLoginAttempt,
} from "@/lib/auth/rate-limit";
import {
  createSession,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    await assertSameOrigin();
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "local";
    const limit = await checkLoginRateLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Te veel inlogpogingen. Probeer later opnieuw." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");

    const user = await prisma.user.findUnique({ where: { username } });
    const ok =
      user && (await verifyPassword(password, user.passwordHash));
    if (!ok) {
      await recordLoginAttempt(ip);
      return NextResponse.json(
        { error: "Ongeldige gebruikersnaam of wachtwoord." },
        { status: 401 },
      );
    }

    const token = await createSession(user!.id);
    const secure = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ ok: true });
    const opts = sessionCookieOptions(token, secure);
    res.cookies.set(opts);
    return res;
  } catch (e) {
    return jsonError(e);
  }
}
