"use client";

import { ProjectShell, useProjectId } from "@/components/layout/ProjectShell";
import { QuickscanForm } from "@/components/projects/QuickscanForm";
import { store, type StoredQuickscan } from "@/lib/client/store";
import { useStoreReady } from "@/lib/client/useStoreReady";
import { Suspense, useEffect, useState } from "react";

function Content() {
  const id = useProjectId();
  const ready = useStoreReady();
  const [answers, setAnswers] = useState<StoredQuickscan[] | null>(null);

  useEffect(() => {
    if (ready && id) setAnswers(store.getQuickscan(id));
  }, [ready, id]);

  if (!ready || !answers || !id) {
    return <p className="text-sm text-[#666]">Laden…</p>;
  }

  return (
    <div>
      <h1 className="page-title mb-4">Projectquickscan</h1>
      <QuickscanForm
        projectId={id}
        initial={answers.map((a) => ({
          questionCode: a.questionCode,
          status: a.status ?? "",
          followUpAction: a.followUpAction ?? "",
          responsible: a.responsible ?? "",
        }))}
      />
    </div>
  );
}

export default function QuickscanPage() {
  return (
    <ProjectShell>
      <Suspense fallback={<p>Laden…</p>}>
        <Content />
      </Suspense>
    </ProjectShell>
  );
}
