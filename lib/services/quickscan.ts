import { prisma } from "@/lib/db";
import {
  validateQuickscanAnswers,
  type QuickscanAnswerInput,
} from "@/lib/validation/quickscan";

export async function getQuickscan(projectId: string) {
  return prisma.quickscanAnswer.findMany({
    where: { projectId },
    orderBy: { questionCode: "asc" },
  });
}

export async function saveQuickscan(
  projectId: string,
  answers: QuickscanAnswerInput[],
) {
  const { normalized } = validateQuickscanAnswers(answers);
  return prisma.$transaction(
    normalized.map((a) =>
      prisma.quickscanAnswer.update({
        where: {
          projectId_questionCode: {
            projectId,
            questionCode: a.questionCode,
          },
        },
        data: {
          status: a.status,
          followUpAction: a.followUpAction,
          responsible: a.responsible,
        },
      }),
    ),
  );
}
