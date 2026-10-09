import { notFound, redirect } from "next/navigation";
import { StreamsForm } from "@/components/projects/StreamsForm";
import { getSessionUser } from "@/lib/auth/session";
import { getProject } from "@/lib/services/projects";
import { getStreams } from "@/lib/services/streams";

export default async function StreamsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getSessionUser())) redirect("/login");
  const { id } = await params;
  if (!(await getProject(id))) notFound();
  const streams = await getStreams(id);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Materiaalstromen</h1>
      <StreamsForm
        projectId={id}
        initial={streams.map((s) => ({
          id: s.id,
          streamCode: s.streamCode,
          occurs: s.occurs ?? "",
          constructionPhase: s.constructionPhase ?? "",
          quantity: s.quantity ?? "",
          unit: s.unit ?? "",
          causeCode: s.causeCode ?? "",
          nextRoute: s.nextRoute ?? "",
          revision: s.revision,
        }))}
      />
    </div>
  );
}
