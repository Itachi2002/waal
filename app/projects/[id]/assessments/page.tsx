import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { AssessmentsPanel } from "@/components/projects/AssessmentsPanel";
import { getSessionUser } from "@/lib/auth/session";
import { listAssessments } from "@/lib/services/assessments";
import { getProject } from "@/lib/services/projects";
import { getStreams } from "@/lib/services/streams";

export default async function AssessmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getSessionUser())) redirect("/login");
  const { id } = await params;
  if (!(await getProject(id))) notFound();
  const [assessments, streams] = await Promise.all([
    listAssessments(id),
    getStreams(id),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Materiaalbeoordeling</h1>
      <Suspense fallback={<p>Laden…</p>}>
        <AssessmentsPanel
          projectId={id}
          assessments={assessments}
          streams={streams.map((s) => ({
            id: s.id,
            streamCode: s.streamCode,
            revision: s.revision,
          }))}
        />
      </Suspense>
    </div>
  );
}
