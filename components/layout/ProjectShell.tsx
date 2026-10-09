"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { ProjectNav } from "@/components/layout/ProjectNav";
import { store, type StoredProject } from "@/lib/client/store";
import { useStoreReady } from "@/lib/client/useStoreReady";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ShellInner({ children }: { children: React.ReactNode }) {
  const search = useSearchParams();
  const projectId = search.get("id") || "";
  const ready = useStoreReady();
  const [project, setProject] = useState<StoredProject | null>(null);

  useEffect(() => {
    if (!ready || !projectId) {
      setProject(null);
      return;
    }
    setProject(store.getProject(projectId));
  }, [ready, projectId]);

  if (!ready) {
    return (
      <div className="app-shell">
        <AppHeader />
        <main className="app-main app-main--no-tabs">
          <p className="text-sm text-[#666]">Laden…</p>
        </main>
      </div>
    );
  }

  if (!projectId || !project) {
    return (
      <div className="app-shell">
        <AppHeader />
        <main className="app-main app-main--no-tabs">
          <p className="surface-card">Project niet gevonden.</p>
          <p className="mt-4 text-center">
            <Link href="/projects/" className="text-[var(--waal-blue-dark)] underline">
              Terug naar projecten
            </Link>
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppHeader
        projectName={project.name}
        scanResponsible={project.scanResponsible}
        showBackToProjects
      />
      <ProjectNav projectId={project.id} />
      <main className="app-main">{children}</main>
    </div>
  );
}

export function ProjectShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="app-shell p-6">Laden…</div>}>
      <ShellInner>{children}</ShellInner>
    </Suspense>
  );
}

export function useProjectId(): string {
  const search = useSearchParams();
  return search.get("id") || "";
}
