import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { createProject, updateProject } from "@/lib/services/projects";
import { saveQuickscan } from "@/lib/services/quickscan";
import { ConflictError } from "@/lib/validation/primitives";
import { createAssessment } from "@/lib/services/assessments";
import { prisma as appPrisma } from "@/lib/db";

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
  await appPrisma.$disconnect();
});

describe("project persistence", () => {
  it("maakt atomair quickscan/stromen/evaluatie aan; behoudt voorloopnullen", async () => {
    const p = await createProject({
      name: "Testproject",
      projectNumber: "00123",
      scanResponsible: "Tester",
      scanDate: "2026-01-15",
    });
    expect(p.projectNumber).toBe("00123");
    expect(p.scanDate).toBe("2026-01-15");

    const qs = await prisma.quickscanAnswer.count({
      where: { projectId: p.id },
    });
    const streams = await prisma.projectMaterialStream.count({
      where: { projectId: p.id },
    });
    const evals = await prisma.evaluationStream.count({
      where: { projectId: p.id },
    });
    expect(qs).toBe(10);
    expect(streams).toBe(17);
    expect(evals).toBe(8);
  });

  it("revisionconflict bij verouderde update", async () => {
    const p = await createProject({
      name: "Conflict",
      scanResponsible: "A",
    });
    await updateProject(p.id, {
      name: "Conflict 2",
      scanResponsible: "A",
      revision: p.revision,
    });
    await expect(
      updateProject(p.id, {
        name: "Conflict 3",
        scanResponsible: "A",
        revision: p.revision,
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("quickscan Nee met actie opslaan; gekoppelde beoordeling zelfde project", async () => {
    const p = await createProject({
      name: "QS",
      scanResponsible: "B",
    });
    await saveQuickscan(p.id, [
      {
        questionCode: "Q01",
        status: "NO",
        followUpAction: "Actie",
        responsible: "B",
      },
      ...Array.from({ length: 9 }, (_, i) => ({
        questionCode: `Q${String(i + 2).padStart(2, "0")}`,
        status: null,
        followUpAction: null,
        responsible: null,
      })),
    ]);
    const stream = await prisma.projectMaterialStream.findFirst({
      where: { projectId: p.id, streamCode: "M11" },
    });
    expect(stream).not.toBeNull();
    const a = await createAssessment(p.id, {
      projectMaterialStreamId: stream!.id,
      materialType: "Pallet",
      condition: null,
      reusable: null,
      returnConfirmed: "CHECK",
      recyclable: null,
      finalRoute: null,
      storageLocation: null,
      followUpAction: null,
      responsible: null,
    });
    expect(a.projectId).toBe(p.id);
    expect(a.finalRoute).toBeNull();
  });
});
