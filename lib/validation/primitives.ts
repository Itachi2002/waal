import { TEXT_LONG_MAX, TEXT_SHORT_MAX } from "@/lib/domain/catalogs";

/** Trim; whitespace-only → null. */
export function normalizeText(
  value: unknown,
  max: number = TEXT_SHORT_MAX,
): string | null {
  if (value == null) return null;
  if (typeof value !== "string") {
    throw new Error("Tekst moet een tekenreeks zijn.");
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > max) {
    throw new Error(`Tekst mag maximaal ${max} tekens bevatten.`);
  }
  return trimmed;
}

export function normalizeLongText(value: unknown): string | null {
  return normalizeText(value, TEXT_LONG_MAX);
}

/**
 * Accepteert NL-komma of punt. Geen ambigue duizendtalsnotatie.
 * Bewaar canonieke string met punt (bijv. "1.25").
 */
export function parseQuantity(value: unknown): string | null {
  if (value == null || value === "") return null;
  let raw = typeof value === "number" ? String(value) : String(value).trim();
  if (raw.length === 0) return null;

  // Afwijzen: duizendtallen met punt én komma, of spaties als scheiding
  if (/\d\.\d{3},\d/.test(raw) || /\d,\d{3}\.\d/.test(raw) || /\s/.test(raw)) {
    throw new Error(
      "Ongeldige hoeveelheid: gebruik een decimaal met komma of punt, zonder duizendtalscheiding.",
    );
  }

  if (raw.includes(",") && raw.includes(".")) {
    throw new Error(
      "Ongeldige hoeveelheid: gebruik alleen komma of alleen punt als decimaalteken.",
    );
  }

  raw = raw.replace(",", ".");

  if (!/^-?\d+(\.\d+)?$/.test(raw)) {
    throw new Error("Ongeldige hoeveelheid.");
  }

  const num = Number(raw);
  if (!Number.isFinite(num)) {
    throw new Error("Hoeveelheid mag geen Infinity of NaN zijn.");
  }
  if (num < 0) {
    throw new Error("Hoeveelheid mag niet negatief zijn.");
  }

  // Canonieke string zonder binaire afronding: behoud ingevoerde decimalen
  if (raw.includes(".")) {
    const [intPart, frac] = raw.split(".");
    const cleanedInt = intPart.replace(/^(-?)0+(\d)/, "$1$2") || "0";
    return `${cleanedInt === "-" ? "-0" : cleanedInt}.${frac}`;
  }
  return String(BigInt(raw)); // strip leading zeros for integers except 0
}

export function parseContainerChanges(value: unknown): number | null {
  if (value == null || value === "") return null;
  const raw = String(value).trim().replace(",", ".");
  if (raw.length === 0) return null;
  if (!/^\d+$/.test(raw)) {
    throw new Error("Containerwissels moet een geheel getal ≥ 0 zijn.");
  }
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("Containerwissels moet een geheel getal ≥ 0 zijn.");
  }
  return n;
}

/** Date-only YYYY-MM-DD; geen tijdzoneconversie. */
export function parseDateOnly(value: unknown): string | null {
  if (value == null || value === "") return null;
  const raw = String(value).trim();
  if (raw.length === 0) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!m) {
    throw new Error("Datum moet als JJJJ-MM-DD worden ingevoerd.");
  }
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    throw new Error("Ongeldige kalenderdatum.");
  }
  return raw;
}

export function parseScore(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isInteger(n) || n < 1 || n > 5) {
    throw new Error("Score moet een geheel getal 1, 2, 3, 4 of 5 zijn.");
  }
  return n;
}

export class FieldValidationError extends Error {
  constructor(
    public fields: Record<string, string>,
    message = "Controleer de gemarkeerde velden.",
  ) {
    super(message);
    this.name = "FieldValidationError";
  }
}

export class ConflictError extends Error {
  constructor(message = "De gegevens zijn ondertussen gewijzigd. Herlaad de pagina en probeer opnieuw.") {
    super(message);
    this.name = "ConflictError";
  }
}
