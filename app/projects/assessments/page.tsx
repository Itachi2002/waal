"use client";

import { Suspense, useEffect, useState } from "react";
import { ProjectShell, useProjectId } from "@/components/layout/ProjectShell";
import { AssessmentsPanel } from "@/components/projects/AssessmentsPanel";
import { store } from "@/lib/client/store";
import { useStoreReady } from "@/lib/client/useStoreReady";

function Content() {
  const id = useProjectId();
  const ready = useStoreReady();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (ready) setTick((t) => t + 1);
  }, [ready, id]);

  if (!ready || !id || tick === 0) {
    return <p className="text-sm text-[#666]">Laden…</p>;
  }

  const assessments = store.listAssessments(id);
  const streams = store.getStreams(id);

  return (
    <div>
      <header className="mb-5">
        <h1 className="page-title">Materiaalbeoordeling</h1>
        <p className="mt-1 text-sm text-[#666]">
          Specifieke materialen beoordelen en route vastleggen.
        </p>
      </header>
      <AssessmentsPanel
        projectId={id}
        assessments={assessments}
        streams={streams.map((s) => ({
          id: s.id,
          streamCode: s.streamCode,
          revision: s.revision,
        }))}
      />
    </div>
  );
}

export default function AssessmentsPage() {
  return (
    <ProjectShell>
      <Suspense fallback={<p>Laden…</p>}>
        <Content />
      </Suspense>
    </ProjectShell>
  );
}
