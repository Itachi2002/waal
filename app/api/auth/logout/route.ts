import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/auth/csrf";
import {
  SESSION_COOKIE,
  destroySession,
} from "@/lib/auth/session";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    await assertSameOrigin();
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (token) await destroySession(token);
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: SESSION_COOKIE,
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch (e) {
    return jsonError(e);
  }
}
