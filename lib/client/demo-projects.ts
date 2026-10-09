import { createId } from "@/lib/client/ids";
import {
  EVALUATION_GROUPS,
  MATERIAL_STREAMS,
  QUICKSCAN_QUESTIONS,
} from "@/lib/domain/catalogs";
import type {
  ProjectBundle,
  StoredAssessment,
  StoredEvalStream,
  StoredEvaluation,
  StoredProject,
  StoredQuickscan,
  StoredStream,
} from "@/lib/client/store"; // type-only — voorkomt runtime-cyclus met store.ts

function emptyEvaluation(): StoredEvaluation {
  return {
    revision: 1,
    attentionStream: null,
    workedWell: null,
    didNotWork: null,
    nextProjectChange: null,
  };
}

function emptyEvalStreams(): StoredEvalStream[] {
  return EVALUATION_GROUPS.map((g) => ({
    groupCode: g.code,
    actualQuantity: null,
    unit: null,
    containerChanges: null,
    route: null,
    explanation: null,
  }));
}

function baseQuickscan(
  overrides: Partial<Record<string, Partial<StoredQuickscan>>> = {},
): StoredQuickscan[] {
  return QUICKSCAN_QUESTIONS.map((q) => ({
    questionCode: q.code,
    status: overrides[q.code]?.status ?? null,
    followUpAction: overrides[q.code]?.followUpAction ?? null,
    responsible: overrides[q.code]?.responsible ?? null,
  }));
}

function baseStreams(
  overrides: Partial<
    Record<
      string,
      Partial<Omit<StoredStream, "id" | "streamCode" | "revision">>
    >
  > = {},
): StoredStream[] {
  return MATERIAL_STREAMS.map((s) => ({
    id: createId(),
    streamCode: s.code,
    occurs: overrides[s.code]?.occurs ?? null,
    constructionPhase: overrides[s.code]?.constructionPhase ?? null,
    quantity: overrides[s.code]?.quantity ?? null,
    unit: overrides[s.code]?.unit ?? null,
    causeCode: overrides[s.code]?.causeCode ?? null,
    nextRoute: overrides[s.code]?.nextRoute ?? null,
    revision: 1,
  }));
}

function project(
  partial: Omit<StoredProject, "createdAt" | "updatedAt" | "revision"> & {
    createdAt?: string;
    updatedAt?: string;
  },
): StoredProject {
  const now = partial.createdAt ?? "2026-03-01T10:00:00.000Z";
  return {
    ...partial,
    createdAt: now,
    updatedAt: partial.updatedAt ?? now,
    revision: 1,
  };
}

/** Vaste demo-projecten voor lokale / GitHub Pages-demo (geen server). */
export function buildDemoProjects(): ProjectBundle[] {
  const renovatieId = "demo-renovatie-havenkwartier";
  const sloopId = "demo-sloop-oude-loods";
  const nieuwbouwId = "demo-nieuwbouw-parklaan";

  const renovatieStreams = baseStreams({
    M02: {
      occurs: "YES",
      constructionPhase: "FINISH",
      quantity: "12",
      unit: "M3",
      causeCode: "O1",
      nextRoute: "REUSE",
    },
    M09: {
      occurs: "YES",
      constructionPhase: "SHELL",
      quantity: "2.5",
      unit: "TON",
      causeCode: "O3",
      nextRoute: "RECYCLE",
    },
    M04: {
      occurs: "YES",
      constructionPhase: "SHELL",
      quantity: "8",
      unit: "TON",
      causeCode: "O2",
      nextRoute: "RECYCLE",
    },
  });

  const houtStream = renovatieStreams.find((s) => s.streamCode === "M02");
  const assessments: StoredAssessment[] = houtStream
    ? [
        {
          id: "demo-assessment-hout-1",
          projectId: renovatieId,
          projectMaterialStreamId: houtStream.id,
          materialType: "Vuren balkhout",
          condition: "GOOD",
          reusable: "YES",
          returnConfirmed: "PARTIAL",
          recyclable: "YES",
          finalRoute: "REUSE",
          storageLocation: "Tijdelijke opslag terrein A",
          followUpAction: "Controle op spijkers voor hergebruik",
          responsible: "J. de Vries",
          revision: 1,
          createdAt: "2026-03-02T09:00:00.000Z",
        },
      ]
    : [];

  return [
    {
      project: project({
        id: renovatieId,
        name: "Renovatie Havenkwartier (test)",
        projectNumber: "WAAL-2026-014",
        scanDate: "2026-03-01",
        executor: "Bouwcombinatie Delta",
        planner: "M. Jansen",
        projectPhase: "Uitvoering",
        scanResponsible: "J. de Vries",
        constructionMethodType: "Renovatie / strip-out",
        scanVersion: "1.0",
        updatedAt: "2026-03-05T14:30:00.000Z",
      }),
      quickscan: baseQuickscan({
        Q01: { status: "YES" },
        Q02: { status: "YES" },
        Q03: {
          status: "NO",
          followUpAction: "Afvalplan actualiseren met opdrachtgever",
          responsible: "M. Jansen",
        },
        Q04: { status: "YES" },
        Q05: { status: "NA" },
        Q06: { status: "YES" },
      }),
      streams: renovatieStreams,
      assessments,
      evaluationStreams: emptyEvalStreams(),
      evaluation: emptyEvaluation(),
    },
    {
      project: project({
        id: sloopId,
        name: "Sloop Oude Loods West (test)",
        projectNumber: "WAAL-2026-022",
        scanDate: "2026-02-12",
        executor: "Sloopbedrijf Noord",
        planner: "A. Bakker",
        projectPhase: "Voorbereiding",
        scanResponsible: "S. Mulder",
        constructionMethodType: "Selectieve sloop",
        scanVersion: "1.0",
        createdAt: "2026-02-12T08:00:00.000Z",
        updatedAt: "2026-02-18T11:20:00.000Z",
      }),
      quickscan: baseQuickscan({
        Q01: { status: "YES" },
        Q02: { status: "NA" },
        Q03: { status: "YES" },
        Q07: { status: "YES" },
      }),
      streams: baseStreams({
        M04: {
          occurs: "YES",
          constructionPhase: "SHELL",
          quantity: "45",
          unit: "TON",
          causeCode: "O3",
          nextRoute: "RECYCLE",
        },
        M12: {
          occurs: "YES",
          constructionPhase: "PREP",
          quantity: "0.3",
          unit: "TON",
          causeCode: "NA",
          nextRoute: "SPECIFIC",
        },
        M09: {
          occurs: "YES",
          constructionPhase: "SHELL",
          quantity: "6",
          unit: "TON",
          causeCode: "O1",
          nextRoute: "RECYCLE",
        },
      }),
      assessments: [],
      evaluationStreams: emptyEvalStreams(),
      evaluation: {
        revision: 1,
        attentionStream: "Chemisch afval – apart laten afvoeren",
        workedWell: "Metaalstromen vroeg gelabeld",
        didNotWork: "Containers te laat besteld",
        nextProjectChange: "Containers 2 weken eerder reserveren",
      },
    },
    {
      project: project({
        id: nieuwbouwId,
        name: "Nieuwbouw Parklaan 12 (test)",
        projectNumber: "WAAL-2026-031",
        scanDate: "2026-03-08",
        executor: "Waal Bouw",
        planner: "L. Peters",
        projectPhase: "Ontwerp",
        scanResponsible: "R. van Dijk",
        constructionMethodType: "Prefab / modulair",
        scanVersion: "1.0",
        createdAt: "2026-03-08T09:15:00.000Z",
        updatedAt: "2026-03-08T09:15:00.000Z",
      }),
      quickscan: baseQuickscan(),
      streams: baseStreams(),
      assessments: [],
      evaluationStreams: emptyEvalStreams(),
      evaluation: emptyEvaluation(),
    },
  ];
}
