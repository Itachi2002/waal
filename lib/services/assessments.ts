import { prisma } from "@/lib/db";
import { validateAssessment } from "@/lib/validation/assessment";
import { ConflictError } from "@/lib/validation/primitives";
import type { StreamCode } from "@/lib/domain/catalogs";

export async function listAssessments(projectId: string) {
  return prisma.materialAssessment.findMany({
    where: { projectId },
    include: { projectMaterialStream: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAssessment(projectId: string, id: string) {
  return prisma.materialAssessment.findFirst({
    where: { id, projectId },
    include: { projectMaterialStream: true },
  });
}

export async function createAssessment(
  projectId: string,
  input: Parameters<typeof validateAssessment>[0],
) {
  let linkedStreamCode: StreamCode | null = null;
  if (input.projectMaterialStreamId) {
    const stream = await prisma.projectMaterialStream.findFirst({
      where: { id: input.projectMaterialStreamId, projectId },
    });
    if (!stream) {
      throw new Error("Gekoppelde stroom hoort niet bij dit project.");
    }
    linkedStreamCode = stream.streamCode as StreamCode;
  }

  const data = validateAssessment({ ...input, linkedStreamCode });
  return prisma.materialAssessment.create({
    data: {
      projectId,
      ...data,
    },
  });
}

export async function updateAssessment(
  projectId: string,
  id: string,
  input: Parameters<typeof validateAssessment>[0] & { revision: number },
) {
  const existing = await prisma.materialAssessment.findFirst({
    where: { id, projectId },
    include: { projectMaterialStream: true },
  });
  if (!existing) throw new Error("Beoordeling niet gevonden.");
  if (existing.revision !== input.revision) throw new ConflictError();

  let linkedStreamCode: StreamCode | null =
    (existing.projectMaterialStream?.streamCode as StreamCode) ?? null;

  if (input.projectMaterialStreamId) {
    const stream = await prisma.projectMaterialStream.findFirst({
      where: { id: input.projectMaterialStreamId, projectId },
    });
    if (!stream) {
      throw new Error("Gekoppelde stroom hoort niet bij dit project.");
    }
    linkedStreamCode = stream.streamCode as StreamCode;
  }

  const data = validateAssessment({ ...input, linkedStreamCode });
  return prisma.materialAssessment.update({
    where: { id },
    data: { ...data, revision: { increment: 1 } },
  });
}

export async function deleteAssessment(projectId: string, id: string) {
  const existing = await prisma.materialAssessment.findFirst({
    where: { id, projectId },
  });
  if (!existing) throw new Error("Beoordeling niet gevonden.");
  await prisma.materialAssessment.delete({ where: { id } });
}
