import {
  EVALUATION_GROUPS,
  MATERIAL_STREAMS,
  QUICKSCAN_QUESTIONS,
  TEXT_SHORT_MAX,
} from "@/lib/domain/catalogs";
import { prisma } from "@/lib/db";
import {
  ConflictError,
  FieldValidationError,
  normalizeText,
  parseDateOnly,
} from "@/lib/validation/primitives";

export type ProjectCreateInput = {
  name: unknown;
  projectNumber?: unknown;
  scanDate?: unknown;
  executor?: unknown;
  planner?: unknown;
  projectPhase?: unknown;
  scanResponsible: unknown;
  constructionMethodType?: unknown;
  scanVersion?: unknown;
};

export type ProjectUpdateInput = ProjectCreateInput & {
  revision: number;
};

function parseProjectFields(input: ProjectCreateInput) {
  const fields: Record<string, string> = {};
  let name: string | null = null;
  let scanResponsible: string | null = null;
  let projectNumber: string | null = null;
  let scanDate: string | null = null;
  let executor: string | null = null;
  let planner: string | null = null;
  let projectPhase: string | null = null;
  let constructionMethodType: string | null = null;
  let scanVersion: string | null = null;

  try {
    name = normalizeText(input.name);
  } catch (e) {
    fields.name = (e as Error).message;
  }
  try {
    scanResponsible = normalizeText(input.scanResponsible);
  } catch (e) {
    fields.scanResponsible = (e as Error).message;
  }
  if (!name) fields.name = "Projectnaam is verplicht.";
  if (!scanResponsible) fields.scanResponsible = "Verantwoordelijke scan is verplicht.";

  try {
    // Behoud voorloopnullen: geen Number-conversie
    const raw = input.projectNumber;
    if (raw == null || raw === "") projectNumber = null;
    else {
      const t = String(raw).trim();
      projectNumber = t.length === 0 ? null : t.slice(0, TEXT_SHORT_MAX);
    }
  } catch (e) {
    fields.projectNumber = (e as Error).message;
  }

  try {
    scanDate = parseDateOnly(input.scanDate);
  } catch (e) {
    fields.scanDate = (e as Error).message;
  }
  try {
    executor = normalizeText(input.executor);
  } catch (e) {
    fields.executor = (e as Error).message;
  }
  try {
    planner = normalizeText(input.planner);
  } catch (e) {
    fields.planner = (e as Error).message;
  }
  try {
    projectPhase = normalizeText(input.projectPhase);
  } catch (e) {
    fields.projectPhase = (e as Error).message;
  }
  try {
    constructionMethodType = normalizeText(input.constructionMethodType);
  } catch (e) {
    fields.constructionMethodType = (e as Error).message;
  }
  try {
    scanVersion = normalizeText(input.scanVersion);
  } catch (e) {
    fields.scanVersion = (e as Error).message;
  }

  if (Object.keys(fields).length > 0) throw new FieldValidationError(fields);

  return {
    name: name!,
    scanResponsible: scanResponsible!,
    projectNumber,
    scanDate,
    executor,
    planner,
    projectPhase,
    constructionMethodType,
    scanVersion,
  };
}

/** Atomair: project + quickscan- + stroom- + evaluatieregels. */
export async function createProject(input: ProjectCreateInput) {
  const data = parseProjectFields(input);
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({ data });
    await tx.quickscanAnswer.createMany({
      data: QUICKSCAN_QUESTIONS.map((q) => ({
        projectId: project.id,
        questionCode: q.code,
      })),
    });
    await tx.projectMaterialStream.createMany({
      data: MATERIAL_STREAMS.map((s) => ({
        projectId: project.id,
        streamCode: s.code,
      })),
    });
    await tx.evaluationStream.createMany({
      data: EVALUATION_GROUPS.map((g) => ({
        projectId: project.id,
        groupCode: g.code,
      })),
    });
    await tx.projectEvaluation.create({
      data: { projectId: project.id },
    });
    return project;
  });
}

export async function updateProject(id: string, input: ProjectUpdateInput) {
  const data = parseProjectFields(input);
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new Error("Project niet gevonden.");
  if (existing.revision !== input.revision) throw new ConflictError();

  return prisma.project.update({
    where: { id },
    data: { ...data, revision: { increment: 1 } },
  });
}

export async function listProjects() {
  return prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      projectNumber: true,
      scanResponsible: true,
      updatedAt: true,
    },
  });
}

export async function getProject(id: string) {
  return prisma.project.findUnique({ where: { id } });
}
