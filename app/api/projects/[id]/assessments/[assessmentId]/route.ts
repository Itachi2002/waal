import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { requireUser } from "@/lib/auth/session";
import { jsonError } from "@/lib/api";
import {
  deleteAssessment,
  updateAssessment,
} from "@/lib/services/assessments";
import { applyRouteToStream } from "@/lib/services/streams";

type Ctx = { params: Promise<{ id: string; assessmentId: string }> };

export async function PUT(request: NextRequest, ctx: Ctx) {
  try {
    await requireUser();
    await assertSameOrigin();
    const { id, assessmentId } = await ctx.params;
    const body = await request.json();
    const assessment = await updateAssessment(id, assessmentId, body);

    // Expliciete overname naar stroom (A04) — alleen wanneer gevraagd
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

    return NextResponse.json({ assessment });
  } catch (e) {
    return jsonError(e);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    await requireUser();
    await assertSameOrigin();
    const { id, assessmentId } = await ctx.params;
    await deleteAssessment(id, assessmentId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return jsonError(e);
  }
}
