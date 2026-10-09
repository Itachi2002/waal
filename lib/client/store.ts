/**
 * Browser-opslag voor GitHub Pages (geen server/SQLite).
 * Data blijft lokaal in localStorage van deze browser.
 */
import {
  EVALUATION_GROUPS,
  MATERIAL_STREAMS,
  QUICKSCAN_QUESTIONS,
} from "@/lib/domain/catalogs";
import { createId } from "@/lib/client/ids";
import {
  FieldValidationError,
  normalizeText,
  parseDateOnly,
} from "@/lib/validation/primitives";
import { validateQuickscanAnswers } from "@/lib/validation/quickscan";
import { validateStreams } from "@/lib/validation/streams";
import { validateAssessment } from "@/lib/validation/assessment";
import {
  ConflictError,
  normalizeLongText,
  parseContainerChanges,
  parseQuantity,
  parseScore,
} from "@/lib/validation/primitives";
import {
  EVALUATION_ROUTES,
  TEXT_SHORT_MAX,
  UNITS,
  YES_PARTIAL_NO,
  type EvaluationRoute,
  type StreamCode,
  type Unit,
  type YesPartialNo,
} from "@/lib/domain/catalogs";
import { isEvaluationRoute } from "@/lib/domain/route-rules";

const STORAGE_KEY = "waal-projectscan-v1";

export type StoredProject = {
  id: string;
  name: string;
  projectNumber: string | null;
  scanDate: string | null;
  executor: string | null;
  planner: string | null;
  projectPhase: string | null;
  scanResponsible: string;
  constructionMethodType: string | null;
  scanVersion: string | null;
  createdAt: string;
  updatedAt: string;
  revision: number;
};

export type StoredQuickscan = {
  questionCode: string;
  status: string | null;
  followUpAction: string | null;
  responsible: string | null;
};

export type StoredStream = {
  id: string;
  streamCode: string;
  occurs: string | null;
  constructionPhase: string | null;
  quantity: string | null;
  unit: string | null;
  causeCode: string | null;
  nextRoute: string | null;
  revision: number;
};

export type StoredAssessment = {
  id: string;
  projectId: string;
  projectMaterialStreamId: string | null;
  materialType: string | null;
  condition: string | null;
  reusable: string | null;
  returnConfirmed: string | null;
  recyclable: string | null;
  finalRoute: string | null;
  storageLocation: string | null;
  followUpAction: string | null;
  responsible: string | null;
  revision: number;
  createdAt: string;
};

export type StoredEvalStream = {
  groupCode: string;
  actualQuantity: string | null;
  unit: string | null;
  containerChanges: number | null;
  route: string | null;
  explanation: string | null;
};

export type StoredEvaluation = {
  revision: number;
  attentionStream: string | null;
  workedWell: string | null;
  didNotWork: string | null;
  nextProjectChange: string | null;
};

export type StoredValidation = {
  revision: number;
  testedBy: string | null;
  role: string | null;
  date: string | null;
  projectSituation: string | null;
  clarityScore: number | null;
  practicalityScore: number | null;
  completenessScore: number | null;
  timeBurdenScore: number | null;
  wouldUse: string | null;
  fitsWaal: string | null;
  keyFeedback: string | null;
  processedChange: string | null;
  remark: string | null;
};

export type ProjectBundle = {
  project: StoredProject;
  quickscan: StoredQuickscan[];
  streams: StoredStream[];
  assessments: StoredAssessment[];
  evaluationStreams: StoredEvalStream[];
  evaluation: StoredEvaluation;
};

type DbShape = {
  projects: ProjectBundle[];
  validation: StoredValidation;
};

function emptyValidation(): StoredValidation {
  return {
    revision: 1,
    testedBy: null,
    role: null,
    date: null,
    projectSituation: null,
    clarityScore: null,
    practicalityScore: null,
    completenessScore: null,
    timeBurdenScore: null,
    wouldUse: null,
    fitsWaal: null,
    keyFeedback: null,
    processedChange: null,
    remark: null,
  };
}

function emptyEvaluation(): StoredEvaluation {
  return {
    revision: 1,
    attentionStream: null,
    workedWell: null,
    didNotWork: null,
    nextProjectChange: null,
  };
}

function buildNewBundle(project: StoredProject): ProjectBundle {
  return {
    project,
    quickscan: QUICKSCAN_QUESTIONS.map((q) => ({
      questionCode: q.code,
      status: null,
      followUpAction: null,
      responsible: null,
    })),
    streams: MATERIAL_STREAMS.map((s) => ({
      id: createId(),
      streamCode: s.code,
      occurs: null,
      constructionPhase: null,
      quantity: null,
      unit: null,
      causeCode: null,
      nextRoute: null,
      revision: 1,
    })),
    assessments: [],
    evaluationStreams: EVALUATION_GROUPS.map((g) => ({
      groupCode: g.code,
      actualQuantity: null,
      unit: null,
      containerChanges: null,
      route: null,
      explanation: null,
    })),
    evaluation: emptyEvaluation(),
  };
}

function defaultDb(): DbShape {
  return { projects: [], validation: emptyValidation() };
}

function readDb(): DbShape {
  if (typeof window === "undefined") return defaultDb();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const db = defaultDb();
      writeDb(db);
      return db;
    }
    return JSON.parse(raw) as DbShape;
  } catch {
    return defaultDb();
  }
}

function writeDb(db: DbShape) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function getBundle(db: DbShape, projectId: string): ProjectBundle {
  const b = db.projects.find((p) => p.project.id === projectId);
  if (!b) throw new Error("Project niet gevonden.");
  return b;
}

function parseProjectFields(input: {
  name: unknown;
  projectNumber?: unknown;
  scanDate?: unknown;
  executor?: unknown;
  planner?: unknown;
  projectPhase?: unknown;
  scanResponsible: unknown;
  constructionMethodType?: unknown;
  scanVersion?: unknown;
}) {
  const fields: Record<string, string> = {};
  let name: string | null = null;
  let scanResponsible: string | null = null;
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

  let projectNumber: string | null = null;
  const raw = input.projectNumber;
  if (raw != null && raw !== "") {
    const t = String(raw).trim();
    projectNumber = t.length === 0 ? null : t.slice(0, TEXT_SHORT_MAX);
  }

  let scanDate: string | null = null;
  let executor: string | null = null;
  let planner: string | null = null;
  let projectPhase: string | null = null;
  let constructionMethodType: string | null = null;
  let scanVersion: string | null = null;
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

  if (Object.keys(fields).length) throw new FieldValidationError(fields);
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

export const store = {
  listProjects(): Array<
    Pick<StoredProject, "id" | "name" | "projectNumber" | "scanResponsible" | "updatedAt">
  > {
    return readDb()
      .projects.map((b) => ({
        id: b.project.id,
        name: b.project.name,
        projectNumber: b.project.projectNumber,
        scanResponsible: b.project.scanResponsible,
        updatedAt: b.project.updatedAt,
      }))
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  },

  getProject(id: string): StoredProject | null {
    const b = readDb().projects.find((p) => p.project.id === id);
    return b?.project ?? null;
  },

  getBundle(id: string): ProjectBundle | null {
    return readDb().projects.find((p) => p.project.id === id) ?? null;
  },

  createProject(input: {
    name: unknown;
    projectNumber?: unknown;
    scanDate?: unknown;
    executor?: unknown;
    planner?: unknown;
    projectPhase?: unknown;
    scanResponsible: unknown;
    constructionMethodType?: unknown;
    scanVersion?: unknown;
  }): StoredProject {
    const data = parseProjectFields(input);
    const now = new Date().toISOString();
    const project: StoredProject = {
      id: createId(),
      ...data,
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };
    const db = readDb();
    db.projects.push(buildNewBundle(project));
    writeDb(db);
    return project;
  },

  updateProject(
    id: string,
    input: {
      name: unknown;
      projectNumber?: unknown;
      scanDate?: unknown;
      executor?: unknown;
      planner?: unknown;
      projectPhase?: unknown;
      scanResponsible: unknown;
      constructionMethodType?: unknown;
      scanVersion?: unknown;
      revision: number;
    },
  ): StoredProject {
    const data = parseProjectFields(input);
    const db = readDb();
    const bundle = getBundle(db, id);
    if (bundle.project.revision !== input.revision) throw new ConflictError();
    bundle.project = {
      ...bundle.project,
      ...data,
      updatedAt: new Date().toISOString(),
      revision: bundle.project.revision + 1,
    };
    writeDb(db);
    return bundle.project;
  },

  getQuickscan(projectId: string) {
    return getBundle(readDb(), projectId).quickscan;
  },

  saveQuickscan(
    projectId: string,
    answers: Array<{
      questionCode: string;
      status: string | null;
      followUpAction: string | null;
      responsible: string | null;
    }>,
  ) {
    const { normalized } = validateQuickscanAnswers(answers);
    const db = readDb();
    const bundle = getBundle(db, projectId);
    bundle.quickscan = normalized.map((a) => ({
      questionCode: a.questionCode,
      status: a.status,
      followUpAction: a.followUpAction,
      responsible: a.responsible,
    }));
    bundle.project.updatedAt = new Date().toISOString();
    writeDb(db);
    return bundle.quickscan;
  },

  getStreams(projectId: string) {
    return getBundle(readDb(), projectId).streams;
  },

  saveStreams(
    projectId: string,
    streams: Array<{
      streamCode: string;
      occurs: string | null;
      constructionPhase: string | null;
      quantity: unknown;
      unit: string | null;
      causeCode: string | null;
      nextRoute: string | null;
    }>,
    revisions?: Record<string, number>,
  ) {
    const { normalized } = validateStreams(streams);
    const db = readDb();
    const bundle = getBundle(db, projectId);
    for (const s of normalized) {
      const row = bundle.streams.find((x) => x.streamCode === s.streamCode);
      if (!row) throw new Error(`Stroom ${s.streamCode} ontbreekt.`);
      if (revisions?.[s.streamCode] != null && row.revision !== revisions[s.streamCode]) {
        throw new ConflictError();
      }
      Object.assign(row, {
        occurs: s.occurs,
        constructionPhase: s.constructionPhase,
        quantity: s.quantity,
        unit: s.unit,
        causeCode: s.causeCode,
        nextRoute: s.nextRoute,
        revision: row.revision + 1,
      });
    }
    bundle.project.updatedAt = new Date().toISOString();
    writeDb(db);
    return bundle.streams;
  },

  listAssessments(projectId: string) {
    const bundle = getBundle(readDb(), projectId);
    return bundle.assessments
      .map((a) => ({
        ...a,
        projectMaterialStream:
          bundle.streams.find((s) => s.id === a.projectMaterialStreamId) ?? null,
      }))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  createAssessment(
    projectId: string,
    input: Parameters<typeof validateAssessment>[0] & {
      applyRouteToStream?: boolean;
      streamRevision?: number;
    },
  ) {
    const db = readDb();
    const bundle = getBundle(db, projectId);
    let linkedStreamCode: StreamCode | null = null;
    if (input.projectMaterialStreamId) {
      const stream = bundle.streams.find((s) => s.id === input.projectMaterialStreamId);
      if (!stream) throw new Error("Gekoppelde stroom hoort niet bij dit project.");
      linkedStreamCode = stream.streamCode as StreamCode;
    }
    const data = validateAssessment({ ...input, linkedStreamCode });
    const assessment: StoredAssessment = {
      id: createId(),
      projectId,
      ...data,
      revision: 1,
      createdAt: new Date().toISOString(),
    };
    bundle.assessments.push(assessment);
    if (
      input.applyRouteToStream &&
      assessment.finalRoute &&
      assessment.projectMaterialStreamId
    ) {
      const stream = bundle.streams.find((s) => s.id === assessment.projectMaterialStreamId);
      if (stream) {
        if (
          input.streamRevision != null &&
          stream.revision !== input.streamRevision
        ) {
          throw new ConflictError();
        }
        stream.nextRoute = assessment.finalRoute;
        stream.revision += 1;
      }
    }
    bundle.project.updatedAt = new Date().toISOString();
    writeDb(db);
    return assessment;
  },

  updateAssessment(
    projectId: string,
    id: string,
    input: Parameters<typeof validateAssessment>[0] & {
      revision: number;
      applyRouteToStream?: boolean;
      streamRevision?: number;
    },
  ) {
    const db = readDb();
    const bundle = getBundle(db, projectId);
    const existing = bundle.assessments.find((a) => a.id === id);
    if (!existing) throw new Error("Beoordeling niet gevonden.");
    if (existing.revision !== input.revision) throw new ConflictError();

    let linkedStreamCode: StreamCode | null = null;
    const linkedId = input.projectMaterialStreamId ?? existing.projectMaterialStreamId;
    if (linkedId) {
      const stream = bundle.streams.find((s) => s.id === linkedId);
      if (!stream) throw new Error("Gekoppelde stroom hoort niet bij dit project.");
      linkedStreamCode = stream.streamCode as StreamCode;
    }
    const data = validateAssessment({ ...input, linkedStreamCode });
    Object.assign(existing, data, { revision: existing.revision + 1 });

    if (input.applyRouteToStream && existing.finalRoute && existing.projectMaterialStreamId) {
      const stream = bundle.streams.find((s) => s.id === existing.projectMaterialStreamId);
      if (stream) {
        if (input.streamRevision != null && stream.revision !== input.streamRevision) {
          throw new ConflictError();
        }
        stream.nextRoute = existing.finalRoute;
        stream.revision += 1;
      }
    }
    bundle.project.updatedAt = new Date().toISOString();
    writeDb(db);
    return existing;
  },

  deleteAssessment(projectId: string, id: string) {
    const db = readDb();
    const bundle = getBundle(db, projectId);
    const before = bundle.assessments.length;
    bundle.assessments = bundle.assessments.filter((a) => a.id !== id);
    if (bundle.assessments.length === before) throw new Error("Beoordeling niet gevonden.");
    writeDb(db);
  },

  getEvaluation(projectId: string) {
    const bundle = getBundle(readDb(), projectId);
    return {
      streams: bundle.evaluationStreams,
      evaluation: bundle.evaluation,
    };
  },

  saveEvaluation(
    projectId: string,
    input: {
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
    },
  ) {
    const db = readDb();
    const bundle = getBundle(db, projectId);
    if (bundle.evaluation.revision !== input.revision) throw new ConflictError();

    const fields: Record<string, string> = {};
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
        if (s.unit) {
          if (!(UNITS as readonly string[]).includes(s.unit)) throw new Error("Ongeldige eenheid.");
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
        if (s.route) {
          if (!isEvaluationRoute(s.route) || !(EVALUATION_ROUTES as readonly string[]).includes(s.route)) {
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
      return { groupCode: s.groupCode, actualQuantity, unit, containerChanges, route, explanation };
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
    if (Object.keys(fields).length) throw new FieldValidationError(fields);

    for (const s of normalizedStreams) {
      const row = bundle.evaluationStreams.find((x) => x.groupCode === s.groupCode);
      if (row) Object.assign(row, s);
    }
    bundle.evaluation = {
      attentionStream,
      workedWell,
      didNotWork,
      nextProjectChange,
      revision: bundle.evaluation.revision + 1,
    };
    bundle.project.updatedAt = new Date().toISOString();
    writeDb(db);
    return bundle.evaluation;
  },

  getValidation(): StoredValidation {
    return readDb().validation;
  },

  saveValidation(input: {
    revision: number;
    testedBy: unknown;
    role: unknown;
    date: unknown;
    projectSituation: unknown;
    clarityScore: unknown;
    practicalityScore: unknown;
    completenessScore: unknown;
    timeBurdenScore: unknown;
    wouldUse: unknown;
    fitsWaal: unknown;
    keyFeedback: unknown;
    processedChange: unknown;
    remark: unknown;
  }): StoredValidation {
    const db = readDb();
    if (db.validation.revision !== input.revision) throw new ConflictError();
    const fields: Record<string, string> = {};
    const data: Partial<StoredValidation> = {};
    const map: Array<[keyof typeof input, (v: unknown) => unknown]> = [
      ["testedBy", normalizeText],
      ["role", normalizeText],
      ["date", parseDateOnly],
      ["projectSituation", normalizeLongText],
      ["clarityScore", parseScore],
      ["practicalityScore", parseScore],
      ["completenessScore", parseScore],
      ["timeBurdenScore", parseScore],
      [
        "wouldUse",
        (v) => {
          if (v == null || v === "") return null;
          if (!(YES_PARTIAL_NO as readonly string[]).includes(String(v))) {
            throw new Error("Zou je dit gebruiken? moet Ja, Deels of Nee zijn.");
          }
          return v as YesPartialNo;
        },
      ],
      [
        "fitsWaal",
        (v) => {
          if (v == null || v === "") return null;
          if (!(YES_PARTIAL_NO as readonly string[]).includes(String(v))) {
            throw new Error("Past bij werkwijze Waal? moet Ja, Deels of Nee zijn.");
          }
          return v as YesPartialNo;
        },
      ],
      ["keyFeedback", normalizeLongText],
      ["processedChange", normalizeLongText],
      ["remark", normalizeLongText],
    ];
    for (const [key, fn] of map) {
      if (key === "revision") continue;
      try {
        (data as Record<string, unknown>)[key] = fn(input[key]);
      } catch (e) {
        fields[key] = (e as Error).message;
      }
    }
    if (Object.keys(fields).length) throw new FieldValidationError(fields);
    db.validation = {
      ...db.validation,
      ...data,
      revision: db.validation.revision + 1,
    } as StoredValidation;
    writeDb(db);
    return db.validation;
  },
};

export { FieldValidationError, ConflictError };
