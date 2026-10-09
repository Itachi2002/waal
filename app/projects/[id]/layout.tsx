import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ProjectNav } from "@/components/layout/ProjectNav";
import { getSessionUser } from "@/lib/auth/session";
import { getProject } from "@/lib/services/projects";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  if (!(await getSessionUser())) redirect("/login");
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div>
      <AppHeader
        projectName={project.name}
        scanResponsible={project.scanResponsible}
      />
      <div className="mx-auto max-w-7xl px-4 py-6 grid gap-6 md:grid-cols-[240px_1fr]">
        <aside>
          <ProjectNav projectId={id} />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
