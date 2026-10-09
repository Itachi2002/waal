import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { jsonError } from "@/lib/api";
import { getEvaluation, saveEvaluation } from "@/lib/services/evaluation";
import { getProject } from "@/lib/services/projects";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!(await getProject(id))) {
      return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });
    }
    const data = await getEvaluation(id);
    return NextResponse.json(data);
  } catch (e) {
    return jsonError(e);
  }
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  try {
    await assertSameOrigin();
    const { id } = await ctx.params;
    const body = await request.json();
    const evaluation = await saveEvaluation(id, body);
    return NextResponse.json({ evaluation });
  } catch (e) {
    return jsonError(e);
  }
}
