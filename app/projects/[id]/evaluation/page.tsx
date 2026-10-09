import { notFound, redirect } from "next/navigation";
import { EvaluationForm } from "@/components/projects/EvaluationForm";
import { getSessionUser } from "@/lib/auth/session";
import { getEvaluation } from "@/lib/services/evaluation";
import { getProject } from "@/lib/services/projects";

export default async function EvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getSessionUser())) redirect("/login");
  const { id } = await params;
  if (!(await getProject(id))) notFound();
  const { streams, evaluation } = await getEvaluation(id);
  if (!evaluation) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Evaluatie</h1>
      <EvaluationForm
        projectId={id}
        revision={evaluation.revision}
        initialStreams={streams.map((s) => ({
          groupCode: s.groupCode,
          actualQuantity: s.actualQuantity ?? "",
          unit: s.unit ?? "",
          containerChanges:
            s.containerChanges == null ? "" : String(s.containerChanges),
          route: s.route ?? "",
          explanation: s.explanation ?? "",
        }))}
        initialQuestions={{
          attentionStream: evaluation.attentionStream ?? "",
          workedWell: evaluation.workedWell ?? "",
          didNotWork: evaluation.didNotWork ?? "",
          nextProjectChange: evaluation.nextProjectChange ?? "",
        }}
      />
    </div>
  );
}
