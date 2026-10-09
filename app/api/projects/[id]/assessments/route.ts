import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { requireUser } from "@/lib/auth/session";
import { jsonError } from "@/lib/api";
import {
  createAssessment,
  listAssessments,
} from "@/lib/services/assessments";
import { getProject } from "@/lib/services/projects";
import { applyRouteToStream } from "@/lib/services/streams";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    await requireUser();
    const { id } = await ctx.params;
    if (!(await getProject(id))) {
      return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });
    }
    const assessments = await listAssessments(id);
    return NextResponse.json({ assessments });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(request: NextRequest, ctx: Ctx) {
  try {
    await requireUser();
    await assertSameOrigin();
    const { id } = await ctx.params;
    const body = await request.json();
    const assessment = await createAssessment(id, body);

    if (
      body.applyRouteToStream === true &&
      assessment.finalRoute &&
      assessment.projectMaterialStreamId
    ) {
      await applyRouteToStream(
        id,
        assessment.projectMaterialStreamId,
        assessment.finalRoute,
        body.streamRevision,
      );
    }

    return NextResponse.json({ assessment }, { status: 201 });
  } catch (e) {
    return jsonError(e);
  }
}
