import { describe, expect, it } from "vitest";
import {
  ASSESSMENT_ROUTES,
  EVALUATION_GROUPS,
  EVALUATION_ROUTES,
  MATERIAL_STREAMS,
  QUICKSCAN_QUESTIONS,
  STREAM_ROUTES,
  ASSESSMENT_ROUTE_LABELS,
  EVALUATION_ROUTE_LABELS,
  STREAM_ROUTE_LABELS,
} from "@/lib/domain/catalogs";
import {
  allowedStreamRoutes,
  assertReturnRouteAllowed,
  isAssessmentRoute,
  isEvaluationRoute,
  isStreamRoute,
} from "@/lib/domain/route-rules";

describe("broncatalogi", () => {
  it("heeft exact 10 quickscanvragen Q01–Q10", () => {
    expect(QUICKSCAN_QUESTIONS).toHaveLength(10);
    expect(QUICKSCAN_QUESTIONS.map((q) => q.code)).toEqual([
      "Q01",
      "Q02",
      "Q03",
      "Q04",
      "Q05",
      "Q06",
      "Q07",
      "Q08",
      "Q09",
      "Q10",
    ]);
  });

  it("heeft exact 17 materiaalstromen M01–M17", () => {
    expect(MATERIAL_STREAMS).toHaveLength(17);
    expect(MATERIAL_STREAMS[0].label).toBe("BSA/bedrijfsafval");
    expect(MATERIAL_STREAMS[11].label).toBe("Chemisch afval");
    expect(MATERIAL_STREAMS[16].label).toBe("Groen afval");
  });

  it("heeft exact 8 evaluatiegroepen", () => {
    expect(EVALUATION_GROUPS).toHaveLength(8);
  });
});

describe("routes per context (AC12)", () => {
  it("Nog beoordelen alleen stromen; Meerdere alleen evaluatie", () => {
    expect(isStreamRoute("NEEDS_ASSESSMENT")).toBe(true);
    expect(isAssessmentRoute("NEEDS_ASSESSMENT")).toBe(false);
    expect(isEvaluationRoute("NEEDS_ASSESSMENT")).toBe(false);
    expect(isEvaluationRoute("MULTIPLE")).toBe(true);
    expect(isStreamRoute("MULTIPLE")).toBe(false);
    expect(ASSESSMENT_ROUTES).toHaveLength(5);
    expect(ASSESSMENT_ROUTES).not.toContain("NEEDS_ASSESSMENT");
  });

  it("bronlabels verschillen waar Excel dat doet", () => {
    expect(STREAM_ROUTE_LABELS.RETURN).toBe("Retour / terugname");
    expect(ASSESSMENT_ROUTE_LABELS.RETURN).toBe("Retour / terugname");
    expect(EVALUATION_ROUTE_LABELS.RETURN).toBe("Retour");
    expect(STREAM_ROUTE_LABELS.RESIDUAL).toBe("BSA / restafval");
    expect(EVALUATION_ROUTE_LABELS.RESIDUAL).toBe("BSA");
  });

  it("chemisch afval alleen SPECIFIC", () => {
    expect(allowedStreamRoutes("M12")).toEqual(["SPECIFIC"]);
    expect(allowedStreamRoutes("M02")).toEqual([...STREAM_ROUTES]);
  });

  it("retourroute vereist bevestiging Ja", () => {
    expect(assertReturnRouteAllowed("YES", "RETURN")).toBeNull();
    expect(assertReturnRouteAllowed("CHECK", "RETURN")).toMatch(/Retour/);
    expect(assertReturnRouteAllowed("NO", "RETURN")).toMatch(/Retour/);
  });
});

describe("C01/A03", () => {
  it("vijf definitieve routes; geen Nog bepalen enum", () => {
    expect([...ASSESSMENT_ROUTES]).toEqual([
      "REUSE",
      "RETURN",
      "RECYCLE",
      "RESIDUAL",
      "SPECIFIC",
    ]);
    expect(EVALUATION_ROUTES).toContain("MULTIPLE");
  });
});
