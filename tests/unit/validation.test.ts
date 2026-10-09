import { describe, expect, it } from "vitest";
import {
  parseContainerChanges,
  parseDateOnly,
  parseQuantity,
  parseScore,
} from "@/lib/validation/primitives";
import { validateQuickscanAnswers } from "@/lib/validation/quickscan";
import { validateStreams } from "@/lib/validation/streams";
import { validateAssessment } from "@/lib/validation/assessment";
import { FieldValidationError } from "@/lib/validation/primitives";

describe("scores", () => {
  it("accepteert 1 en 5; wijst 0, 6, 2.5 en tekst af; null behouden", () => {
    expect(parseScore(1)).toBe(1);
    expect(parseScore(5)).toBe(5);
    expect(parseScore(null)).toBeNull();
    expect(parseScore("")).toBeNull();
    expect(() => parseScore(0)).toThrow();
    expect(() => parseScore(6)).toThrow();
    expect(() => parseScore(2.5)).toThrow();
    expect(() => parseScore("goed")).toThrow();
  });
});

describe("hoeveelheden", () => {
  it("komma/punt, null vs nul, geen negatief", () => {
    expect(parseQuantity("1,25")).toBe("1.25");
    expect(parseQuantity("1.25")).toBe("1.25");
    expect(parseQuantity(null)).toBeNull();
    expect(parseQuantity("0")).toBe("0");
    expect(() => parseQuantity("-1")).toThrow();
    expect(() => parseQuantity("1.000,5")).toThrow();
  });
});

describe("containerwissels", () => {
  it("integer ≥ 0 of null", () => {
    expect(parseContainerChanges("3")).toBe(3);
    expect(parseContainerChanges(null)).toBeNull();
    expect(() => parseContainerChanges("1.5")).toThrow();
    expect(() => parseContainerChanges("-1")).toThrow();
  });
});

describe("datum", () => {
  it("valideert kalender date-only", () => {
    expect(parseDateOnly("2026-02-28")).toBe("2026-02-28");
    expect(() => parseDateOnly("2026-02-30")).toThrow();
    expect(parseDateOnly(null)).toBeNull();
  });
});

describe("quickscan Nee-actie", () => {
  it("wijst Nee zonder actie en whitespace-actie af", () => {
    expect(() =>
      validateQuickscanAnswers([
        {
          questionCode: "Q01",
          status: "NO",
          followUpAction: null,
          responsible: null,
        },
      ]),
    ).toThrow(FieldValidationError);

    expect(() =>
      validateQuickscanAnswers([
        {
          questionCode: "Q01",
          status: "NO",
          followUpAction: "   ",
          responsible: null,
        },
      ]),
    ).toThrow(FieldValidationError);

    expect(
      validateQuickscanAnswers([
        {
          questionCode: "Q01",
          status: "NO",
          followUpAction: "Actie uitvoeren",
          responsible: null,
        },
      ]).normalized[0].followUpAction,
    ).toBe("Actie uitvoeren");

    expect(
      validateQuickscanAnswers([
        {
          questionCode: "Q01",
          status: "YES",
          followUpAction: null,
          responsible: null,
        },
      ]).normalized[0].status,
    ).toBe("YES");
  });
});

describe("stromen", () => {
  it("chemisch niet als BSA/retour/hergebruik", () => {
    expect(() =>
      validateStreams([
        {
          streamCode: "M12",
          occurs: "YES",
          constructionPhase: null,
          quantity: null,
          unit: null,
          causeCode: null,
          nextRoute: "RESIDUAL",
        },
      ]),
    ).toThrow(FieldValidationError);

    expect(
      validateStreams([
        {
          streamCode: "M12",
          occurs: "YES",
          constructionPhase: null,
          quantity: null,
          unit: null,
          causeCode: null,
          nextRoute: "SPECIFIC",
        },
      ]).normalized[0].nextRoute,
    ).toBe("SPECIFIC");
  });

  it("hoeveelheid zonder eenheid afgewezen", () => {
    expect(() =>
      validateStreams([
        {
          streamCode: "M02",
          occurs: "YES",
          constructionPhase: null,
          quantity: "1",
          unit: null,
          causeCode: null,
          nextRoute: null,
        },
      ]),
    ).toThrow(FieldValidationError);
  });
});

describe("assessment", () => {
  it("retour zonder Ja-bevestiging afgewezen", () => {
    expect(() =>
      validateAssessment({
        materialType: "Pallet",
        condition: null,
        reusable: null,
        returnConfirmed: "CHECK",
        recyclable: null,
        finalRoute: "RETURN",
        storageLocation: null,
        followUpAction: null,
        responsible: null,
      }),
    ).toThrow(FieldValidationError);
  });

  it("open beoordeling heeft null finalRoute (C01/A03)", () => {
    const r = validateAssessment({
      materialType: "Pallet",
      condition: "GOOD",
      reusable: null,
      returnConfirmed: "CHECK",
      recyclable: null,
      finalRoute: null,
      storageLocation: null,
      followUpAction: null,
      responsible: null,
    });
    expect(r.finalRoute).toBeNull();
  });

  it("chemisch gekoppelde beoordeling alleen SPECIFIC", () => {
    expect(() =>
      validateAssessment({
        materialType: "PUR",
        condition: null,
        reusable: null,
        returnConfirmed: "NA",
        recyclable: null,
        finalRoute: "REUSE",
        storageLocation: null,
        followUpAction: null,
        responsible: null,
        linkedStreamCode: "M12",
      }),
    ).toThrow(FieldValidationError);
  });
});
