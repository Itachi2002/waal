import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { getSessionUser } from "@/lib/auth/session";

export default async function NewProjectPage() {
  if (!(await getSessionUser())) redirect("/login");

  return (
    <div>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-2">Nieuw project</h1>
        <p className="text-sm text-[#555] mb-6">
          Projectnaam en verantwoordelijke scan zijn verplicht. Overige velden
          mogen later worden aangevuld.
        </p>
        <div className="rounded-md border border-[#d8dee5] bg-white p-6">
          <ProjectForm
            mode="create"
            initial={{
              name: "",
              projectNumber: "",
              scanDate: "",
              executor: "",
              planner: "",
              projectPhase: "",
              scanResponsible: "",
              constructionMethodType: "",
              scanVersion: "",
            }}
          />
        </div>
      </main>
    </div>
  );
}
