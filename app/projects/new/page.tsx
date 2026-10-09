import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { getSessionUser } from "@/lib/auth/session";

export default async function NewProjectPage() {
  if (!(await getSessionUser())) redirect("/login");

  return (
    <div className="app-shell">
      <AppHeader showBackToProjects />
      <main className="app-main app-main--no-tabs">
        <h1 className="text-2xl font-semibold mb-1">Nieuw project</h1>
        <p className="text-sm text-[#666] mb-5">
          Projectnaam en verantwoordelijke scan zijn verplicht.
        </p>
        <div className="surface-card">
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
