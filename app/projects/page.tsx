import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { getSessionUser } from "@/lib/auth/session";
import { listProjects } from "@/lib/services/projects";
import { IconArrowRight, IconPlus } from "@/components/icons/Icons";

export default async function ProjectsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  const projects = await listProjects();

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main app-main--no-tabs">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h1 className="page-title">Projecten</h1>
            <p className="mt-1 text-sm text-[#666]">
              Kies een scan of start een nieuw project.
            </p>
          </div>
          <Link
            href="/projects/new"
            className="btn btn-primary shrink-0 gap-1.5 !px-3.5"
            aria-label="Nieuw project"
          >
            <IconPlus className="h-4 w-4" />
            Nieuw
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <p className="font-medium">Nog geen projecten</p>
            <p className="text-sm text-[#666]">Tik op Nieuw om te starten.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.id}/start`}
                  className="surface-card flex items-center gap-3 active:bg-[var(--waal-gray)]"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug">
                      {p.name}
                    </span>
                    <span className="mt-1 block text-sm text-[#666]">
                      {p.projectNumber || "Geen nummer"} · {p.scanResponsible}
                    </span>
                  </div>
                  <IconArrowRight className="h-5 w-5 shrink-0 text-[#9aa5b1]" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-center text-sm">
          <Link
            href="/validation"
            className="font-medium text-[var(--waal-blue-dark)] underline"
          >
            Onderzoeksvalidatie
          </Link>
        </p>
      </main>
    </div>
  );
}
