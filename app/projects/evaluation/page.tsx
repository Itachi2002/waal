"use client";

import { Suspense, useEffect, useState } from "react";
import { ProjectShell, useProjectId } from "@/components/layout/ProjectShell";
import { EvaluationForm } from "@/components/projects/EvaluationForm";
import { store } from "@/lib/client/store";
import { useStoreReady } from "@/lib/client/useStoreReady";

function Content() {
  const id = useProjectId();
  const ready = useStoreReady();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ready && id) setLoaded(true);
  }, [ready, id]);

  if (!ready || !loaded || !id) {
    return <p className="text-sm text-[#666]">Laden…</p>;
  }

  const data = store.getEvaluation(id);
  if (!data.evaluation) return <p>Evaluatie ontbreekt.</p>;

  return (
    <div>
      <h1 className="page-title mb-4">Evaluatie</h1>
      <EvaluationForm
        projectId={id}
        revision={data.evaluation.revision}
        initialStreams={data.streams.map((s) => ({
          groupCode: s.groupCode,
          actualQuantity: s.actualQuantity ?? "",
          unit: s.unit ?? "",
          containerChanges:
            s.containerChanges == null ? "" : String(s.containerChanges),
          route: s.route ?? "",
          explanation: s.explanation ?? "",
        }))}
        initialQuestions={{
          attentionStream: data.evaluation.attentionStream ?? "",
          workedWell: data.evaluation.workedWell ?? "",
          didNotWork: data.evaluation.didNotWork ?? "",
          nextProjectChange: data.evaluation.nextProjectChange ?? "",
        }}
      />
    </div>
  );
}

export default function EvaluationPage() {
  return (
    <ProjectShell>
      <Suspense fallback={<p>Laden…</p>}>
        <Content />
      </Suspense>
    </ProjectShell>
  );
}
