import {
  CAUSE_CODES,
  CHEMICAL_STREAM_CODE,
  CONSTRUCTION_PHASES,
  OCCURS_OPTIONS,
  UNITS,
  type CauseCode,
  type ConstructionPhase,
  type OccursOption,
  type StreamCode,
  type StreamRoute,
  type Unit,
} from "@/lib/domain/catalogs";
import {
  assertStreamRouteAllowed,
  isStreamRoute,
} from "@/lib/domain/route-rules";
import {
  FieldValidationError,
  parseQuantity,
} from "./primitives";

export type StreamInput = {
  streamCode: string;
  occurs: string | null;
  constructionPhase: string | null;
  quantity: unknown;
  unit: string | null;
  causeCode: string | null;
  nextRoute: string | null;
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

export function validateStreams(inputs: StreamInput[]) {
  const fields: Record<string, string> = {};
  const normalized = inputs.map((s) => {
    const code = s.streamCode as StreamCode;
    let occurs: OccursOption | null = null;
    let constructionPhase: ConstructionPhase | null = null;
    let quantity: string | null = null;
    let unit: Unit | null = null;
    let causeCode: CauseCode | null = null;
    let nextRoute: StreamRoute | null = null;

    try {
      occurs = parseEnum(s.occurs, OCCURS_OPTIONS, "Komt voor?");
    } catch (e) {
      fields[`${code}.occurs`] = (e as Error).message;
    }
    try {
      constructionPhase = parseEnum(
        s.constructionPhase,
        CONSTRUCTION_PHASES,
        "Bouwfase",
      );
    } catch (e) {
      fields[`${code}.constructionPhase`] = (e as Error).message;
    }
    try {
      quantity = parseQuantity(s.quantity);
    } catch (e) {
      fields[`${code}.quantity`] = (e as Error).message;
    }
    try {
      unit = parseEnum(s.unit, UNITS, "Eenheid");
    } catch (e) {
      fields[`${code}.unit`] = (e as Error).message;
    }
    try {
      causeCode = parseEnum(s.causeCode, CAUSE_CODES, "Oorzaakcode");
    } catch (e) {
      fields[`${code}.causeCode`] = (e as Error).message;
    }
    try {
      if (s.nextRoute != null && s.nextRoute !== "") {
        if (!isStreamRoute(String(s.nextRoute))) {
          throw new Error("Ongeldige vervolgroute.");
        }
        nextRoute = s.nextRoute as StreamRoute;
      }
    } catch (e) {
      fields[`${code}.nextRoute`] = (e as Error).message;
    }

    if (quantity != null && unit == null) {
      fields[`${code}.unit`] = "Een eenheid is verplicht wanneer een hoeveelheid is ingevuld.";
    }

    if (nextRoute != null) {
      const err = assertStreamRouteAllowed(code, nextRoute);
      if (err) fields[`${code}.nextRoute`] = err;
    }

    // Bij Nee: geen verplichte hoeveelheid/route (A02: details mogen blijven)
    if (occurs === "NO") {
      // no extra required fields
    }

    if (code === CHEMICAL_STREAM_CODE && nextRoute != null && nextRoute !== "SPECIFIC") {
      fields[`${code}.nextRoute`] =
        "Voor chemisch afval is alleen «Specifieke afvalroute» toegestaan.";
    }

    return {
      streamCode: code,
      occurs,
      constructionPhase,
      quantity,
      unit,
      causeCode,
      nextRoute,
    };
  });

  if (Object.keys(fields).length > 0) {
    throw new FieldValidationError(fields);
  }
  return { normalized };
}
