import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AssessmentsPanel } from "@/components/projects/AssessmentsPanel";
import { listAssessments } from "@/lib/services/assessments";
import { getProject } from "@/lib/services/projects";
import { getStreams } from "@/lib/services/streams";

export default async function AssessmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!(await getProject(id))) notFound();
  const [assessments, streams] = await Promise.all([
    listAssessments(id),
    getStreams(id),
  ]);

  return (
    <div>
      <header className="mb-5">
        <h1 className="page-title">Materiaalbeoordeling</h1>
        <p className="mt-1 text-sm text-[#666]">
          Specifieke materialen beoordelen en route vastleggen.
        </p>
      </header>
      <Suspense fallback={<p className="text-sm text-[#666]">Laden…</p>}>
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
