import { notFound } from "next/navigation";
import { QuickscanForm } from "@/components/projects/QuickscanForm";
import { getProject } from "@/lib/services/projects";
import { getQuickscan } from "@/lib/services/quickscan";

export default async function QuickscanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!(await getProject(id))) notFound();
  const answers = await getQuickscan(id);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Projectquickscan</h1>
      <QuickscanForm
        projectId={id}
        initial={answers.map((a) => ({
          questionCode: a.questionCode,
          status: a.status ?? "",
          followUpAction: a.followUpAction ?? "",
          responsible: a.responsible ?? "",
        }))}
      />
    </div>
  );
}
