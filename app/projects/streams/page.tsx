"use client";

import { ProjectShell, useProjectId } from "@/components/layout/ProjectShell";
import { StreamsForm } from "@/components/projects/StreamsForm";
import { store, type StoredStream } from "@/lib/client/store";
import { useStoreReady } from "@/lib/client/useStoreReady";
import { Suspense, useEffect, useState } from "react";

function Content() {
  const id = useProjectId();
  const ready = useStoreReady();
  const [streams, setStreams] = useState<StoredStream[] | null>(null);

  useEffect(() => {
    if (ready && id) setStreams(store.getStreams(id));
  }, [ready, id]);

  if (!ready || !streams || !id) {
    return <p className="text-sm text-[#666]">Laden…</p>;
  }

  return (
    <div>
      <h1 className="page-title mb-4">Materiaalstromen</h1>
      <StreamsForm
        projectId={id}
        initial={streams.map((s) => ({
          id: s.id,
          streamCode: s.streamCode,
          occurs: s.occurs ?? "",
          constructionPhase: s.constructionPhase ?? "",
          quantity: s.quantity ?? "",
          unit: s.unit ?? "",
          causeCode: s.causeCode ?? "",
          nextRoute: s.nextRoute ?? "",
          revision: s.revision,
        }))}
      />
    </div>
  );
}

export default function StreamsPage() {
  return (
    <ProjectShell>
      <Suspense fallback={<p>Laden…</p>}>
        <Content />
      </Suspense>
    </ProjectShell>
  );
}
