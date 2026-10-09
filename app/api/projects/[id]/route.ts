import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { requireUser } from "@/lib/auth/session";
import { jsonError } from "@/lib/api";
import { getProject, updateProject } from "@/lib/services/projects";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    await requireUser();
    const { id } = await ctx.params;
    const project = await getProject(id);
    if (!project) {
      return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (e) {
    return jsonError(e);
  }
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  try {
    await requireUser();
    await assertSameOrigin();
    const { id } = await ctx.params;
    const body = await request.json();
    const project = await updateProject(id, body);
    return NextResponse.json({ project });
  } catch (e) {
    return jsonError(e);
  }
}
