import {
  EVALUATION_ROUTES,
  UNITS,
  type EvaluationRoute,
  type Unit,
} from "@/lib/domain/catalogs";
import { isEvaluationRoute } from "@/lib/domain/route-rules";
import { prisma } from "@/lib/db";
import {
  ConflictError,
  FieldValidationError,
  normalizeLongText,
  parseContainerChanges,
  parseQuantity,
} from "@/lib/validation/primitives";

export type EvaluationSaveInput = {
  revision: number;
  streams: Array<{
    groupCode: string;
    actualQuantity: unknown;
    unit: string | null;
    containerChanges: unknown;
    route: string | null;
    explanation: unknown;
  }>;
  attentionStream: unknown;
  workedWell: unknown;
  didNotWork: unknown;
  nextProjectChange: unknown;
};

export async function getEvaluation(projectId: string) {
  const [streams, evaluation] = await Promise.all([
    prisma.evaluationStream.findMany({
      where: { projectId },
      orderBy: { groupCode: "asc" },
    }),
    prisma.projectEvaluation.findUnique({ where: { projectId } }),
  ]);
  return { streams, evaluation };
}

export async function saveEvaluation(projectId: string, input: EvaluationSaveInput) {
  const fields: Record<string, string> = {};
  const evalRow = await prisma.projectEvaluation.findUnique({
    where: { projectId },
  });
  if (!evalRow) throw new Error("Evaluatie ontbreekt.");
  if (evalRow.revision !== input.revision) throw new ConflictError();

  const normalizedStreams = input.streams.map((s) => {
    let actualQuantity: string | null = null;
    let unit: Unit | null = null;
    let containerChanges: number | null = null;
    let route: EvaluationRoute | null = null;
    let explanation: string | null = null;

    try {
      actualQuantity = parseQuantity(s.actualQuantity);
    } catch (e) {
      fields[`${s.groupCode}.actualQuantity`] = (e as Error).message;
    }
    try {
      if (s.unit != null && s.unit !== "") {
        if (!(UNITS as readonly string[]).includes(s.unit)) {
          throw new Error("Ongeldige eenheid.");
        }
        unit = s.unit as Unit;
      }
    } catch (e) {
      fields[`${s.groupCode}.unit`] = (e as Error).message;
    }
    try {
      containerChanges = parseContainerChanges(s.containerChanges);
    } catch (e) {
      fields[`${s.groupCode}.containerChanges`] = (e as Error).message;
    }
    try {
      if (s.route != null && s.route !== "") {
        if (!isEvaluationRoute(s.route)) throw new Error("Ongeldige route.");
        if (!(EVALUATION_ROUTES as readonly string[]).includes(s.route)) {
          throw new Error("Ongeldige route.");
        }
        route = s.route as EvaluationRoute;
      }
    } catch (e) {
      fields[`${s.groupCode}.route`] = (e as Error).message;
    }
    try {
      explanation = normalizeLongText(s.explanation);
    } catch (e) {
      fields[`${s.groupCode}.explanation`] = (e as Error).message;
    }

    if (actualQuantity != null && unit == null) {
      fields[`${s.groupCode}.unit`] =
        "Een eenheid is verplicht wanneer een hoeveelheid is ingevuld.";
    }

    return {
      groupCode: s.groupCode,
      actualQuantity,
      unit,
      containerChanges,
      route,
      explanation,
    };
  });

  let attentionStream: string | null = null;
  let workedWell: string | null = null;
  let didNotWork: string | null = null;
  let nextProjectChange: string | null = null;
  try {
    attentionStream = normalizeLongText(input.attentionStream);
  } catch (e) {
    fields.attentionStream = (e as Error).message;
  }
  try {
    workedWell = normalizeLongText(input.workedWell);
  } catch (e) {
    fields.workedWell = (e as Error).message;
  }
  try {
    didNotWork = normalizeLongText(input.didNotWork);
  } catch (e) {
    fields.didNotWork = (e as Error).message;
  }
  try {
    nextProjectChange = normalizeLongText(input.nextProjectChange);
  } catch (e) {
    fields.nextProjectChange = (e as Error).message;
  }

  if (Object.keys(fields).length > 0) throw new FieldValidationError(fields);

  return prisma.$transaction(async (tx) => {
    for (const s of normalizedStreams) {
      await tx.evaluationStream.update({
        where: {
          projectId_groupCode: { projectId, groupCode: s.groupCode },
        },
        data: {
          actualQuantity: s.actualQuantity,
          unit: s.unit,
          containerChanges: s.containerChanges,
          route: s.route,
          explanation: s.explanation,
        },
      });
    }
    return tx.projectEvaluation.update({
      where: { projectId },
      data: {
        attentionStream,
        workedWell,
        didNotWork,
        nextProjectChange,
        revision: { increment: 1 },
      },
    });
  });
}
