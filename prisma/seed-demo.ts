/**
 * Synthetische demo-seed — expliciet aan te roepen. Fictieve data, gelabeld.
 * Wist geen bestaande gebruikersprojecten; maakt/ververst alleen DEMO-001.
 */
import { PrismaClient } from "@prisma/client";
import { createProject } from "../lib/services/projects";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.project.findFirst({
    where: { projectNumber: "DEMO-001" },
  });
  if (existing) {
    await prisma.project.delete({ where: { id: existing.id } });
  }

  const project = await createProject({
    name: "Fictief demo-project — Demo woningbouw",
    projectNumber: "DEMO-001",
    scanDate: "2026-03-01",
    executor: "Demo uitvoerder",
    planner: "Demo werkvoorbereider",
    projectPhase: "Ruwbouw",
    scanResponsible: "Demo verantwoordelijke",
    constructionMethodType: "Traditioneel",
    scanVersion: "demo-1",
  });

  // Quickscan mix
  const qs = [
    { code: "Q01", status: "YES", followUpAction: null, responsible: "Demo WV" },
    {
      code: "Q02",
      status: "NO",
      followUpAction: "Verwachte stromen alsnog in kaart brengen vóór start afbouw",
      responsible: "Demo WV",
    },
    { code: "Q03", status: "YES", followUpAction: null, responsible: null },
    {
      code: "Q04",
      status: "NO",
      followUpAction: "Retourvoorwaarden bij leverancier controleren",
      responsible: "Demo inkoper",
    },
    { code: "Q05", status: "NA", followUpAction: null, responsible: null },
    { code: "Q06", status: "YES", followUpAction: null, responsible: "Demo KAM-input" },
    { code: "Q07", status: null, followUpAction: null, responsible: null },
    { code: "Q08", status: "NA", followUpAction: null, responsible: null },
    { code: "Q09", status: "YES", followUpAction: null, responsible: null },
    { code: "Q10", status: null, followUpAction: null, responsible: null },
  ];
  for (const a of qs) {
    await prisma.quickscanAnswer.update({
      where: {
        projectId_questionCode: { projectId: project.id, questionCode: a.code },
      },
      data: {
        status: a.status,
        followUpAction: a.followUpAction,
        responsible: a.responsible,
      },
    });
  }

  // Hout M02
  await prisma.projectMaterialStream.update({
    where: {
      projectId_streamCode: { projectId: project.id, streamCode: "M02" },
    },
    data: {
      occurs: "YES",
      constructionPhase: "SHELL",
      quantity: "1.25",
      unit: "TON",
      causeCode: "O2",
      nextRoute: "REUSE",
    },
  });

  // Pallets M11 — Nog beoordelen
  const pallets = await prisma.projectMaterialStream.update({
    where: {
      projectId_streamCode: { projectId: project.id, streamCode: "M11" },
    },
    data: {
      occurs: "YES",
      constructionPhase: "MULTIPLE",
      quantity: "12",
      unit: "PIECES",
      causeCode: "O8",
      nextRoute: "NEEDS_ASSESSMENT",
    },
  });

  await prisma.materialAssessment.create({
    data: {
      projectId: project.id,
      projectMaterialStreamId: pallets.id,
      materialType: "Retourpallets (fictief)",
      condition: "GOOD",
      reusable: "YES",
      returnConfirmed: "CHECK",
      recyclable: "CHECK",
      finalRoute: null,
      followUpAction: "Leverancier retourvoorwaarden voor dit project controleren",
      responsible: "Demo verantwoordelijke",
    },
  });

  // Chemisch M12
  await prisma.projectMaterialStream.update({
    where: {
      projectId_streamCode: { projectId: project.id, streamCode: "M12" },
    },
    data: {
      occurs: "YES",
      constructionPhase: "FINISH",
      quantity: "2",
      unit: "BAGS",
      causeCode: "NA",
      nextRoute: "SPECIFIC",
    },
  });

  // M01 Nee
  await prisma.projectMaterialStream.update({
    where: {
      projectId_streamCode: { projectId: project.id, streamCode: "M01" },
    },
    data: { occurs: "NO" },
  });
  // M17 blijft onbeantwoord (null)

  // Evaluatie (handmatig, geen som)
  await prisma.evaluationStream.update({
    where: {
      projectId_groupCode: { projectId: project.id, groupCode: "E02" },
    },
    data: {
      actualQuantity: "1.10",
      unit: "TON",
      containerChanges: 3,
      route: "REUSE",
      explanation: "Fictieve werkelijke houtstroom na afloop",
    },
  });
  await prisma.evaluationStream.update({
    where: {
      projectId_groupCode: { projectId: project.id, groupCode: "E01" },
    },
    data: {
      actualQuantity: "0",
      unit: "TON",
      containerChanges: 0,
      route: "RESIDUAL",
      explanation: "Echte nul als fixture",
    },
  });

  await prisma.projectEvaluation.update({
    where: { projectId: project.id },
    data: {
      attentionStream: "Pallets/retourmiddelen vroegen de meeste aandacht (fictief).",
      workedWell: "Vroege afstemming containers werkte goed.",
      didNotWork: "Retourcontrole te laat in het proces.",
      nextProjectChange: "Retourvoorwaarden vóór bestelling vastleggen.",
    },
  });

  await prisma.productValidation.upsert({
    where: { singletonKey: "default" },
    create: {
      singletonKey: "default",
      testedBy: "Demo tester",
      role: "Werkvoorbereider (fictief)",
      date: "2026-03-15",
      projectSituation: "Fictief demo-project DEMO-001",
      clarityScore: 4,
      practicalityScore: 3,
      completenessScore: 5,
      timeBurdenScore: 2,
      wouldUse: "PARTIAL",
      fitsWaal: "YES",
      keyFeedback: "Duidelijke stappen; retourcontrole mag prominenter.",
      processedChange: "Helptekst retourbevestiging aangescherpt (demo).",
      remark: "Geen berekend eindcijfer — individuele scores.",
    },
    update: {
      testedBy: "Demo tester",
      role: "Werkvoorbereider (fictief)",
      date: "2026-03-15",
      projectSituation: "Fictief demo-project DEMO-001",
      clarityScore: 4,
      practicalityScore: 3,
      completenessScore: 5,
      timeBurdenScore: 2,
      wouldUse: "PARTIAL",
      fitsWaal: "YES",
      keyFeedback: "Duidelijke stappen; retourcontrole mag prominenter.",
      processedChange: "Helptekst retourbevestiging aangescherpt (demo).",
      remark: "Geen berekend eindcijfer — individuele scores.",
    },
  });

  console.log(`Demo-project aangemaakt: ${project.id} (DEMO-001)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
