import {
  QUICKSCAN_STATUSES,
  type QuickscanStatus,
} from "@/lib/domain/catalogs";
import { FieldValidationError, normalizeLongText, normalizeText } from "./primitives";

export type QuickscanAnswerInput = {
  questionCode: string;
  status: string | null;
  followUpAction: string | null;
  responsible: string | null;
};

export function parseQuickscanStatus(value: unknown): QuickscanStatus | null {
  if (value == null || value === "") return null;
  const v = String(value);
  if (!(QUICKSCAN_STATUSES as readonly string[]).includes(v)) {
    throw new Error("Status moet Ja, Nee of n.v.t. zijn.");
  }
  return v as QuickscanStatus;
}

export function validateQuickscanAnswers(answers: QuickscanAnswerInput[]): {
  normalized: Array<{
    questionCode: string;
    status: QuickscanStatus | null;
    followUpAction: string | null;
    responsible: string | null;
  }>;
} {
  const fields: Record<string, string> = {};
  const normalized = answers.map((a) => {
    let status: QuickscanStatus | null = null;
    let followUpAction: string | null = null;
    let responsible: string | null = null;
    try {
      status = parseQuickscanStatus(a.status);
    } catch (e) {
      fields[`${a.questionCode}.status`] = (e as Error).message;
    }
    try {
      followUpAction = normalizeLongText(a.followUpAction);
    } catch (e) {
      fields[`${a.questionCode}.followUpAction`] = (e as Error).message;
    }
    try {
      responsible = normalizeText(a.responsible);
    } catch (e) {
      fields[`${a.questionCode}.responsible`] = (e as Error).message;
    }

    if (status === "NO" && !followUpAction) {
      fields[`${a.questionCode}.followUpAction`] =
        "Bij status Nee is een concrete vervolgactie verplicht.";
    }
    return {
      questionCode: a.questionCode,
      status,
      followUpAction,
      responsible,
    };
  });

  if (Object.keys(fields).length > 0) {
    throw new FieldValidationError(fields);
  }
  return { normalized };
}
