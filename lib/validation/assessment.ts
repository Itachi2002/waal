import {
  ASSESSMENT_ROUTES,
  CONDITIONS,
  RECYCLABLE,
  RETURN_CONFIRMED,
  TRI_STATE,
  type AssessmentRoute,
  type Condition,
  type Recyclable,
  type ReturnConfirmed,
  type TriState,
} from "@/lib/domain/catalogs";
import {
  assertChemicalAssessmentRoute,
  assertReturnRouteAllowed,
} from "@/lib/domain/route-rules";
import {
  FieldValidationError,
  normalizeLongText,
  normalizeText,
} from "./primitives";
import type { StreamCode } from "@/lib/domain/catalogs";

export type AssessmentInput = {
  materialType: unknown;
  condition: string | null;
  reusable: string | null;
  returnConfirmed: string | null;
  recyclable: string | null;
  finalRoute: string | null;
  storageLocation: unknown;
  followUpAction: unknown;
  responsible: unknown;
  projectMaterialStreamId?: string | null;
  linkedStreamCode?: StreamCode | null;
  revision?: number;
};

function parseEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  label: string,
): T | null {
  if (value == null || value === "") return null;
  const v = String(value);
  if (!(allowed as readonly string[]).includes(v)) {
    throw new Error(`Ongeldige waarde voor ${label}.`);
  }
  return v as T;
}

export function validateAssessment(input: AssessmentInput) {
  const fields: Record<string, string> = {};
  let materialType: string | null = null;
  let condition: Condition | null = null;
  let reusable: TriState | null = null;
  let returnConfirmed: ReturnConfirmed | null = null;
  let recyclable: Recyclable | null = null;
  let finalRoute: AssessmentRoute | null = null;
  let storageLocation: string | null = null;
  let followUpAction: string | null = null;
  let responsible: string | null = null;

  try {
    materialType = normalizeText(input.materialType);
  } catch (e) {
    fields.materialType = (e as Error).message;
  }
  try {
    condition = parseEnum(input.condition, CONDITIONS, "Conditie");
  } catch (e) {
    fields.condition = (e as Error).message;
  }
  try {
    reusable = parseEnum(input.reusable, TRI_STATE, "Hergebruik?");
  } catch (e) {
    fields.reusable = (e as Error).message;
  }
  try {
    returnConfirmed = parseEnum(
      input.returnConfirmed,
      RETURN_CONFIRMED,
      "Retour bevestigd?",
    );
  } catch (e) {
    fields.returnConfirmed = (e as Error).message;
  }
  try {
    recyclable = parseEnum(input.recyclable, RECYCLABLE, "Recycling/verwerking?");
  } catch (e) {
    fields.recyclable = (e as Error).message;
  }
  try {
    if (input.finalRoute != null && input.finalRoute !== "") {
      finalRoute = parseEnum(
        input.finalRoute,
        ASSESSMENT_ROUTES,
        "Definitieve route",
      );
    }
  } catch (e) {
    fields.finalRoute = (e as Error).message;
  }
  try {
    storageLocation = normalizeText(input.storageLocation);
  } catch (e) {
    fields.storageLocation = (e as Error).message;
  }
  try {
    followUpAction = normalizeLongText(input.followUpAction);
  } catch (e) {
    fields.followUpAction = (e as Error).message;
  }
  try {
    responsible = normalizeText(input.responsible);
  } catch (e) {
    fields.responsible = (e as Error).message;
  }

  const returnErr = assertReturnRouteAllowed(returnConfirmed, finalRoute);
  if (returnErr) fields.finalRoute = returnErr;

  const chemErr = assertChemicalAssessmentRoute(
    input.linkedStreamCode ?? null,
    finalRoute,
  );
  if (chemErr) fields.finalRoute = chemErr;

  if (Object.keys(fields).length > 0) {
    throw new FieldValidationError(fields);
  }

  return {
    materialType,
    condition,
    reusable,
    returnConfirmed,
    recyclable,
    finalRoute,
    storageLocation,
    followUpAction,
    responsible,
    projectMaterialStreamId: input.projectMaterialStreamId ?? null,
  };
}
