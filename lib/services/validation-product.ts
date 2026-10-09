import {
  YES_PARTIAL_NO,
  type YesPartialNo,
} from "@/lib/domain/catalogs";
import { prisma } from "@/lib/db";
import {
  ConflictError,
  FieldValidationError,
  normalizeLongText,
  normalizeText,
  parseDateOnly,
  parseScore,
} from "@/lib/validation/primitives";

export type ProductValidationInput = {
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
};

function parseYpn(value: unknown, label: string): YesPartialNo | null {
  if (value == null || value === "") return null;
  const v = String(value);
  if (!(YES_PARTIAL_NO as readonly string[]).includes(v)) {
    throw new Error(`${label} moet Ja, Deels of Nee zijn.`);
  }
  return v as YesPartialNo;
}

export async function getProductValidation() {
  let row = await prisma.productValidation.findUnique({
    where: { singletonKey: "default" },
  });
  if (!row) {
    row = await prisma.productValidation.create({
      data: { singletonKey: "default" },
    });
  }
  return row;
}

export async function saveProductValidation(input: ProductValidationInput) {
  const existing = await getProductValidation();
  if (existing.revision !== input.revision) throw new ConflictError();

  const fields: Record<string, string> = {};
  const data: Record<string, unknown> = {};

  const map: Array<[keyof ProductValidationInput, (v: unknown) => unknown]> = [
    ["testedBy", normalizeText],
    ["role", normalizeText],
    ["date", parseDateOnly],
    ["projectSituation", normalizeLongText],
    ["clarityScore", parseScore],
    ["practicalityScore", parseScore],
    ["completenessScore", parseScore],
    ["timeBurdenScore", parseScore],
    ["wouldUse", (v) => parseYpn(v, "Zou je dit gebruiken?")],
    ["fitsWaal", (v) => parseYpn(v, "Past bij werkwijze Waal?")],
    ["keyFeedback", normalizeLongText],
    ["processedChange", normalizeLongText],
    ["remark", normalizeLongText],
  ];

  for (const [key, fn] of map) {
    if (key === "revision") continue;
    try {
      data[key] = fn(input[key]);
    } catch (e) {
      fields[key] = (e as Error).message;
    }
  }

  if (Object.keys(fields).length > 0) throw new FieldValidationError(fields);

  return prisma.productValidation.update({
    where: { singletonKey: "default" },
    data: { ...data, revision: { increment: 1 } },
  });
}
