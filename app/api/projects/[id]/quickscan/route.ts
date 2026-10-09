import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { jsonError } from "@/lib/api";
import { getQuickscan, saveQuickscan } from "@/lib/services/quickscan";
import { getProject } from "@/lib/services/projects";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!(await getProject(id))) {
      return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });
    }
    const answers = await getQuickscan(id);
    return NextResponse.json({ answers });
  } catch (e) {
    return jsonError(e);
  }
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  try {
    await assertSameOrigin();
    const { id } = await ctx.params;
    const body = await request.json();
    const answers = await saveQuickscan(id, body.answers ?? []);
    return NextResponse.json({ answers });
  } catch (e) {
    return jsonError(e);
  }
}
