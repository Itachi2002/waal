import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { getSessionUser } from "@/lib/auth/session";
import { listProjects } from "@/lib/services/projects";

export default async function ProjectsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  const projects = await listProjects();

  return (
    <div>
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Projecten</h1>
          <Link href="/projects/new" className="btn btn-primary">
            Nieuw project
          </Link>
        </div>
        <p className="mb-4 text-sm text-[#555]">
          Eenvoudige projectlijst voor de lokale scan. Geen KPI&apos;s of scores.
        </p>
        {projects.length === 0 ? (
          <p className="rounded border border-[#d8dee5] bg-white p-6">
            Nog geen projecten. Maak een nieuw project aan om te starten.
          </p>
        ) : (
          <ul className="space-y-3">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.id}/start`}
                  className="block rounded-md border border-[#d8dee5] bg-white p-4 hover:border-[var(--waal-blue)]"
                >
                  <span className="font-semibold">{p.name}</span>
                  <span className="block text-sm text-[#555] mt-1">
                    Nummer: {p.projectNumber || "—"} · Scan: {p.scanResponsible}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-8">
          <Link href="/validation" className="text-[var(--waal-blue-dark)] underline">
            Onderzoeksvalidatie beroepsproduct
          </Link>
          <span className="text-sm text-[#555]">
            {" "}
            — apart van projectstappen
          </span>
        </p>
      </main>
    </div>
  );
}
