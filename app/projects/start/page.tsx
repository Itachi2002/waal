"use client";

import { ProjectShell, useProjectId } from "@/components/layout/ProjectShell";
import { ProjectForm } from "@/components/projects/ProjectForm";
import {
  DECISION_ORDER,
  PROJECT_START_STEPS,
} from "@/lib/domain/catalogs";
import { IconArrowRight, IconCheck } from "@/components/icons/Icons";
import { store, type StoredProject } from "@/lib/client/store";
import { useStoreReady } from "@/lib/client/useStoreReady";
import { Suspense, useEffect, useState } from "react";

function StartContent() {
  const id = useProjectId();
  const ready = useStoreReady();
  const [project, setProject] = useState<StoredProject | null>(null);

  useEffect(() => {
    if (ready && id) setProject(store.getProject(id));
  }, [ready, id]);

  if (!ready || !project) return <p className="text-sm text-[#666]">Laden…</p>;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="page-title">Projectstart</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#555]">
          Inzicht in vrijkomende afval- en reststromen, oorzaken en passende
          vervolgstappen. Gegevens blijven in deze browser (GitHub Pages).
        </p>
      </header>

      <section className="surface-card">
        <h2 className="section-title mb-3">Vijf stappen</h2>
        <ol className="space-y-2.5">
          {PROJECT_START_STEPS.map((s, i) => (
            <li
              key={s}
              className="flex gap-3 rounded-xl bg-[var(--waal-gray)] px-3 py-2.5 text-sm"
            >
              <span className="step-badge">{i + 1}</span>
              <span className="leading-snug">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="surface-card">
        <h2 className="section-title mb-3">Beslisvolgorde</h2>
        <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
          {DECISION_ORDER.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-1.5">
              <span className="rounded-lg bg-[#e8f3fa] px-2.5 py-1 text-[var(--waal-blue-dark)]">
                {step}
              </span>
              {i < DECISION_ORDER.length - 1 ? (
                <IconArrowRight className="h-3.5 w-3.5 text-[#9aa5b1]" />
              ) : null}
            </span>
          ))}
        </div>
        <ul className="mt-4 space-y-2 text-sm text-[#555]">
          <li className="flex gap-2">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--waal-blue)]" />
            Specifieke afvalroutes altijd passend toepassen.
          </li>
          <li className="flex gap-2">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--waal-blue)]" />
            BSA is de laatste route wanneer geen hogere of specifieke route past.
          </li>
          <li className="flex gap-2">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--waal-blue)]" />
            «Voorkomen» is werkinstructie, geen dropdownwaarde.
          </li>
        </ul>
      </section>

      <section className="surface-card">
        <h2 className="section-title mb-4">Projectgegevens</h2>
        <ProjectForm
          mode="edit"
          projectId={project.id}
          initial={{
            name: project.name,
            projectNumber: project.projectNumber ?? "",
            scanDate: project.scanDate ?? "",
            executor: project.executor ?? "",
            planner: project.planner ?? "",
            projectPhase: project.projectPhase ?? "",
            scanResponsible: project.scanResponsible,
            constructionMethodType: project.constructionMethodType ?? "",
            scanVersion: project.scanVersion ?? "",
            revision: project.revision,
          }}
        />
      </section>
    </div>
  );
}

export default function StartPage() {
  return (
    <ProjectShell>
      <Suspense fallback={<p>Laden…</p>}>
        <StartContent />
      </Suspense>
    </ProjectShell>
  );
}
