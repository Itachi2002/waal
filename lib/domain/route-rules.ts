import {
  ASSESSMENT_ROUTES,
  CHEMICAL_STREAM_CODE,
  EVALUATION_ROUTES,
  STREAM_ROUTES,
  type AssessmentRoute,
  type EvaluationRoute,
  type ReturnConfirmed,
  type StreamCode,
  type StreamRoute,
} from "./catalogs";

export function isStreamRoute(value: string): value is StreamRoute {
  return (STREAM_ROUTES as readonly string[]).includes(value);
}

export function isAssessmentRoute(value: string): value is AssessmentRoute {
  return (ASSESSMENT_ROUTES as readonly string[]).includes(value);
}

export function isEvaluationRoute(value: string): value is EvaluationRoute {
  return (EVALUATION_ROUTES as readonly string[]).includes(value);
}

/** Chemisch afval (M12): alleen Specifieke afvalroute als vastgelegde vervolgroute. */
export function allowedStreamRoutes(streamCode: StreamCode): StreamRoute[] {
  if (streamCode === CHEMICAL_STREAM_CODE) {
    return ["SPECIFIC"];
  }
  return [...STREAM_ROUTES];
}

export function assertStreamRouteAllowed(
  streamCode: StreamCode,
  route: StreamRoute | null | undefined,
): string | null {
  if (route == null) return null;
  const allowed = allowedStreamRoutes(streamCode);
  if (!allowed.includes(route)) {
    return "Voor chemisch afval is alleen «Specifieke afvalroute» toegestaan als vervolgroute.";
  }
  return null;
}

/** Retourroute mag alleen bij Retour bevestigd? = Ja. */
export function assertReturnRouteAllowed(
  returnConfirmed: ReturnConfirmed | null | undefined,
  finalRoute: AssessmentRoute | null | undefined,
): string | null {
  if (finalRoute === "RETURN" && returnConfirmed !== "YES") {
    return "Retour / terugname mag alleen worden vastgelegd wanneer «Retour bevestigd?» Ja is (controle voor dit project).";
  }
  return null;
}

/** Bij wijziging bevestiging van Ja→Nee terwijl route RETURN: corrigeer route. */
export function assertReturnConfirmationConsistent(
  returnConfirmed: ReturnConfirmed | null | undefined,
  finalRoute: AssessmentRoute | null | undefined,
): string | null {
  return assertReturnRouteAllowed(returnConfirmed, finalRoute);
}

export function assertChemicalAssessmentRoute(
  streamCode: StreamCode | null | undefined,
  finalRoute: AssessmentRoute | null | undefined,
): string | null {
  if (streamCode === CHEMICAL_STREAM_CODE && finalRoute != null && finalRoute !== "SPECIFIC") {
    return "Chemisch afval met gekoppelde beoordeling volgt uitsluitend de specifieke afvalroute.";
  }
  return null;
}
