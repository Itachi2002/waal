import { headers } from "next/headers";

/** Origincontrole voor mutaties (CSRF-mitigatie naast SameSite-cookie). */
export async function assertSameOrigin(): Promise<void> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  if (!origin) {
    // Same-origin form posts from older browsers may omit Origin; check Referer
    const referer = h.get("referer");
    if (!referer || !host) return;
    try {
      const refHost = new URL(referer).host;
      if (refHost !== host) {
        throw new CsrfError();
      }
    } catch (e) {
      if (e instanceof CsrfError) throw e;
      throw new CsrfError();
    }
    return;
  }
  try {
    const originHost = new URL(origin).host;
    if (!host || originHost !== host) {
      throw new CsrfError();
    }
  } catch (e) {
    if (e instanceof CsrfError) throw e;
    throw new CsrfError();
  }
}

export class CsrfError extends Error {
  status = 403;
  constructor() {
    super("Ongeldige herkomst van het verzoek.");
    this.name = "CsrfError";
  }
}
