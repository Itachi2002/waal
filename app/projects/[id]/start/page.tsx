import { notFound, redirect } from "next/navigation";
import { ProjectForm } from "@/components/projects/ProjectForm";
import {
  DECISION_ORDER,
  PROJECT_START_STEPS,
} from "@/lib/domain/catalogs";
import { getSessionUser } from "@/lib/auth/session";
import { getProject } from "@/lib/services/projects";

export default async function StartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getSessionUser())) redirect("/login");
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="space-y-8">
      <section className="rounded-md border border-[#d8dee5] bg-white p-6">
        <h1 className="text-2xl font-semibold mb-2">Projectstart</h1>
        <p className="text-[#555] mb-4">
          Doel: per woningbouwproject inzicht in vrijkomende afval- en
          reststromen, oorzaken en passende vervolgstappen. Ondersteunt
          werkvoorbereiding en uitvoering. Geen automatische systeemkoppeling;
          gebruik beschikbare projectgegevens handmatig.
        </p>
        <h2 className="font-semibold mt-4 mb-2">Vijf stappen</h2>
        <ol className="list-decimal pl-5 space-y-1">
          {PROJECT_START_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <h2 className="font-semibold mt-6 mb-2">Beslisvolgorde</h2>
        <p className="mb-2">{DECISION_ORDER.join(" → ")}</p>
        <ul className="text-sm text-[#555] list-disc pl-5 space-y-1">
          <li>
            Specifieke afvalroutes altijd passend toepassen; ze zijn geen
            laagste voorkeursroute.
          </li>
          <li>
            BSA is de laatste route wanneer een hogere of specifieke route niet
            passend is.
          </li>
          <li>
            «Voorkomen» is een werkinstructie, geen dropdownwaarde in de scan.
          </li>
          <li>
            Nieuwe relevante informatie na controle handmatig doorgeven aan de
            KAM-coördinator (geen mail-/notificatiefunctie in deze app).
          </li>
        </ul>
      </section>

      <section className="rounded-md border border-[#d8dee5] bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">Projectgegevens</h2>
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
