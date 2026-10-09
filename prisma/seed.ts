/**
 * Catalog seed — read-only brondefinities. Overschrijft geen gebruikersrecords.
 */
import { PrismaClient } from "@prisma/client";
import {
  EVALUATION_GROUPS,
  MATERIAL_STREAMS,
  QUICKSCAN_QUESTIONS,
} from "../lib/domain/catalogs";

const prisma = new PrismaClient();

async function main() {
  for (const q of QUICKSCAN_QUESTIONS) {
    await prisma.quickscanDefinition.upsert({
      where: { code: q.code },
      create: {
        code: q.code,
        sortOrder: q.sortOrder,
        subject: q.subject,
        question: q.question,
        sourceRef: q.sourceRef,
      },
      update: {
        sortOrder: q.sortOrder,
        subject: q.subject,
        question: q.question,
        sourceRef: q.sourceRef,
      },
    });
  }

  for (const s of MATERIAL_STREAMS) {
    await prisma.materialStreamDefinition.upsert({
      where: { code: s.code },
      create: {
        code: s.code,
        label: s.label,
        examples: s.examples,
        sortOrder: s.sortOrder,
        sourceRef: s.sourceRef,
      },
      update: {
        label: s.label,
        examples: s.examples,
        sortOrder: s.sortOrder,
        sourceRef: s.sourceRef,
      },
    });
  }

  for (const g of EVALUATION_GROUPS) {
    await prisma.evaluationGroupDefinition.upsert({
      where: { code: g.code },
      create: {
        code: g.code,
        label: g.label,
        sortOrder: g.sortOrder,
        sourceRef: g.sourceRef,
      },
      update: {
        label: g.label,
        sortOrder: g.sortOrder,
        sourceRef: g.sourceRef,
      },
    });
  }

  await prisma.productValidation.upsert({
    where: { singletonKey: "default" },
    create: { singletonKey: "default" },
    update: {},
  });

  console.log("Catalog seed voltooid (quickscan, stromen, evaluatiegroepen).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
