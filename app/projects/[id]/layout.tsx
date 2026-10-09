import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ProjectNav } from "@/components/layout/ProjectNav";
import { getProject } from "@/lib/services/projects";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="app-shell">
      <AppHeader
        projectName={project.name}
        scanResponsible={project.scanResponsible}
        showBackToProjects
      />
      <ProjectNav projectId={id} />
      <main className="app-main">{children}</main>
    </div>
  );
}
