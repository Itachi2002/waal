import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { jsonError } from "@/lib/api";
import { createProject, listProjects } from "@/lib/services/projects";

export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json({ projects });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    await assertSameOrigin();
    const body = await request.json();
    const project = await createProject(body);
    return NextResponse.json({ project }, { status: 201 });
  } catch (e) {
    return jsonError(e);
  }
}
