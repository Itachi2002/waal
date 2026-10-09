/** Broncatalogi R02–R05 — stabiele codes, exacte bronlabels. */

export const QUICKSCAN_STATUSES = ["YES", "NO", "NA"] as const;
export type QuickscanStatus = (typeof QUICKSCAN_STATUSES)[number];

export const QUICKSCAN_STATUS_LABELS: Record<QuickscanStatus, string> = {
  YES: "Ja",
  NO: "Nee",
  NA: "n.v.t.",
};

export const QUICKSCAN_QUESTIONS = [
  {
    code: "Q01",
    sortOrder: 1,
    subject: "Ontwerp/maatvoering",
    question:
      "Zijn standaardmaten, maatvoering en mogelijkheden om snij- en zaagverlies te beperken beoordeeld?",
    sourceRef: "Projectquickscan!A7:E7",
  },
  {
    code: "Q02",
    sortOrder: 2,
    subject: "Werkvoorbereiding",
    question:
      "Zijn verwachte materiaal- en afvalstromen vóór de uitvoering in kaart gebracht?",
    sourceRef: "Projectquickscan!A8:E8",
  },
  {
    code: "Q03",
    sortOrder: 3,
    subject: "Inkoop",
    question:
      "Zijn hoeveelheden afgestemd op de werkelijke behoefte om overbestelling te beperken?",
    sourceRef: "Projectquickscan!A9:E9",
  },
  {
    code: "Q04",
    sortOrder: 4,
    subject: "Leveranciers/retour",
    question:
      "Zijn retourmogelijkheden en verpakkingsafspraken vóór bestelling of levering gecontroleerd?",
    sourceRef: "Projectquickscan!A10:E10",
  },
  {
    code: "Q05",
    sortOrder: 5,
    subject: "Logistiek & materiaalbescherming",
    question:
      "Zijn levermomenten en tijdelijke opslag zo georganiseerd dat beschadiging en materiaalverlies worden beperkt?",
    sourceRef: "Projectquickscan!A11:E11",
  },
  {
    code: "Q06",
    sortOrder: 6,
    subject: "Afvalscheiding & containers",
    question:
      "Is bepaald welke stromen apart worden ingezameld en staan containers logisch voor het project?",
    sourceRef: "Projectquickscan!A12:E12",
  },
  {
    code: "Q07",
    sortOrder: 7,
    subject: "Verantwoordelijkheid",
    question:
      "Is duidelijk wie de scan bijhoudt en wie verantwoordelijk is voor afvalscheiding en hergebruik op de bouwplaats?",
    sourceRef: "Projectquickscan!A13:E13",
  },
  {
    code: "Q08",
    sortOrder: 8,
    subject: "Onderaannemers",
    question:
      "Zijn afspraken over scheiding, afval en restmateriaal vooraf gecommuniceerd?",
    sourceRef: "Projectquickscan!A14:E14",
  },
  {
    code: "Q09",
    sortOrder: 9,
    subject: "Registratie",
    question:
      "Worden beschikbare gegevens over containerwissels, gewichten en opvallende materiaalstromen bijgehouden?",
    sourceRef: "Projectquickscan!A15:E15",
  },
  {
    code: "Q10",
    sortOrder: 10,
    subject: "Projectoverleg & evaluatie",
    question:
      "Worden afval/hergebruik besproken en is een evaluatiemoment na afloop gepland?",
    sourceRef: "Projectquickscan!A16:E16",
  },
] as const;

export type QuickscanCode = (typeof QUICKSCAN_QUESTIONS)[number]["code"];

export const OCCURS_OPTIONS = ["YES", "NO"] as const;
export type OccursOption = (typeof OCCURS_OPTIONS)[number];
export const OCCURS_LABELS: Record<OccursOption, string> = {
  YES: "Ja",
  NO: "Nee",
};

export const CONSTRUCTION_PHASES = [
  "DESIGN",
  "PREP",
  "SHELL",
  "FINISH",
  "MULTIPLE",
  "NA",
] as const;
export type ConstructionPhase = (typeof CONSTRUCTION_PHASES)[number];
export const CONSTRUCTION_PHASE_LABELS: Record<ConstructionPhase, string> = {
  DESIGN: "Ontwerp",
  PREP: "Werkvoorbereiding",
  SHELL: "Ruwbouw",
  FINISH: "Afbouw",
  MULTIPLE: "Meerdere",
  NA: "n.v.t.",
};

export const UNITS = [
  "KG",
  "TON",
  "M3",
  "PIECES",
  "PALLETS",
  "CONTAINERS",
  "BAGS",
  "OTHER",
] as const;
export type Unit = (typeof UNITS)[number];
export const UNIT_LABELS: Record<Unit, string> = {
  KG: "kg",
  TON: "ton",
  M3: "m³",
  PIECES: "stuks",
  PALLETS: "pallets",
  CONTAINERS: "containers",
  BAGS: "zakken",
  OTHER: "anders",
};

export const CAUSE_CODES = [
  "O1",
  "O2",
  "O3",
  "O4",
  "O5",
  "O6",
  "O7",
  "O8",
  "MULTIPLE",
  "NA",
] as const;
export type CauseCode = (typeof CAUSE_CODES)[number];
export const CAUSE_LABELS: Record<CauseCode, string> = {
  O1: "O1 Ontwerp / maatvoering",
  O2: "O2 Zaag- en snijverlies",
  O3: "O3 Faalkosten/ fouten",
  O4: "O4 Logistiek/planning",
  O5: "O5 Verpakking",
  O6: "O6 Beperkte ruimte",
  O7: "O7 Verantwoordelijkheid",
  O8: "O8 Inkoop/retour",
  MULTIPLE: "Meerdere",
  NA: "n.v.t.",
};

/** Routescodes — contextafhankelijk; geen globale enum zonder regels. */
export const ROUTE_CODES = [
  "REUSE",
  "RETURN",
  "RECYCLE",
  "SPECIFIC",
  "RESIDUAL",
  "NEEDS_ASSESSMENT",
  "MULTIPLE",
] as const;
export type RouteCode = (typeof ROUTE_CODES)[number];

export const STREAM_ROUTES = [
  "REUSE",
  "RETURN",
  "RECYCLE",
  "RESIDUAL",
  "SPECIFIC",
  "NEEDS_ASSESSMENT",
] as const;
export type StreamRoute = (typeof STREAM_ROUTES)[number];

/** A03: vijf expliciete routes; null = nog open (UI: Nog te bepalen). */
export const ASSESSMENT_ROUTES = [
  "REUSE",
  "RETURN",
  "RECYCLE",
  "RESIDUAL",
  "SPECIFIC",
] as const;
export type AssessmentRoute = (typeof ASSESSMENT_ROUTES)[number];

export const EVALUATION_ROUTES = [
  "REUSE",
  "RETURN",
  "RECYCLE",
  "SPECIFIC",
  "RESIDUAL",
  "MULTIPLE",
] as const;
export type EvaluationRoute = (typeof EVALUATION_ROUTES)[number];

export const STREAM_ROUTE_LABELS: Record<StreamRoute, string> = {
  REUSE: "Hergebruik",
  RETURN: "Retour / terugname",
  RECYCLE: "Recycling / verwerking",
  RESIDUAL: "BSA / restafval",
  SPECIFIC: "Specifieke afvalroute",
  NEEDS_ASSESSMENT: "Nog beoordelen",
};

export const ASSESSMENT_ROUTE_LABELS: Record<AssessmentRoute, string> = {
  REUSE: "Hergebruik",
  RETURN: "Retour / terugname",
  RECYCLE: "Recycling / verwerking",
  RESIDUAL: "BSA / restafval",
  SPECIFIC: "Specifieke afvalroute",
};

export const EVALUATION_ROUTE_LABELS: Record<EvaluationRoute, string> = {
  REUSE: "Hergebruik",
  RETURN: "Retour",
  RECYCLE: "Recycling / verwerking",
  SPECIFIC: "Specifieke afvalroute",
  RESIDUAL: "BSA",
  MULTIPLE: "Meerdere",
};

export const MATERIAL_STREAMS = [
  {
    code: "M01",
    label: "BSA/bedrijfsafval",
    examples: "Sorteerbaar, gemengd of brandbaar bedrijfsafval",
    sortOrder: 1,
    sourceRef: "Materiaalstromen!A8",
  },
  {
    code: "M02",
    label: "Hout",
    examples: "A-, B- en A/B-kwaliteit; bouwhout",
    sortOrder: 2,
    sourceRef: "Materiaalstromen!A9",
  },
  {
    code: "M03",
    label: "Beton / restbeton",
    examples: "Restbeton, overgebleven beton",
    sortOrder: 3,
    sourceRef: "Materiaalstromen!A10",
  },
  {
    code: "M04",
    label: "Overige minerale stromen",
    examples:
      "Betonpuin, metselwerkpuin, baksteenpuin, dakpannen van beton/klei",
    sortOrder: 4,
    sourceRef: "Materiaalstromen!A11",
  },
  {
    code: "M05",
    label: "Kunststeen/composiet",
    examples: "Kunsthars, kwarts, vezelmateriaal",
    sortOrder: 5,
    sourceRef: "Materiaalstromen!A12",
  },
  {
    code: "M06",
    label: "Dakafval",
    examples: "EPDM, PVC",
    sortOrder: 6,
    sourceRef: "Materiaalstromen!A13",
  },
  {
    code: "M07",
    label: "Mortels",
    examples: "Metselmortel, restanten droge mortels",
    sortOrder: 7,
    sourceRef: "Materiaalstromen!A14",
  },
  {
    code: "M08",
    label: "Natuursteen/tegels",
    examples: "Natuursteen, wand- en vloertegels",
    sortOrder: 8,
    sourceRef: "Materiaalstromen!A15",
  },
  {
    code: "M09",
    label: "Metaal",
    examples: "Staal, ferro- en non-ferrometalen",
    sortOrder: 9,
    sourceRef: "Materiaalstromen!A16",
  },
  {
    code: "M10",
    label: "Verpakkingsmateriaal",
    examples: "Papier, karton, bedrukte folie, monofolie, overige verpakkingen",
    sortOrder: 10,
    sourceRef: "Materiaalstromen!A17",
  },
  {
    code: "M11",
    label: "Pallets/retourmiddelen",
    examples: "Eenmalige pallets, retourkratten",
    sortOrder: 11,
    sourceRef: "Materiaalstromen!A18",
  },
  {
    code: "M12",
    label: "Chemisch afval",
    examples:
      "Batterijen, olie, lijm/kit, oplosmiddelen, PUR (met/zonder statiegeld), verf",
    sortOrder: 12,
    sourceRef: "Materiaalstromen!A19",
  },
  {
    code: "M13",
    label: "Gips",
    examples: "Gipsplaten (Gyproc), gipsblokken",
    sortOrder: 13,
    sourceRef: "Materiaalstromen!A20",
  },
  {
    code: "M14",
    label: "Lijmblokken",
    examples: "Kalkzandsteen, cellenbeton",
    sortOrder: 14,
    sourceRef: "Materiaalstromen!A21",
  },
  {
    code: "M15",
    label: "Isolatie",
    examples: "Steenwol, glaswol, Therma/Kooltherm, IKO, EPS",
    sortOrder: 15,
    sourceRef: "Materiaalstromen!A22",
  },
  {
    code: "M16",
    label: "Kunststoffen/folie",
    examples: "Kunststof en folie buiten de verpakkingsstroom",
    sortOrder: 16,
    sourceRef: "Materiaalstromen!A23",
  },
  {
    code: "M17",
    label: "Groen afval",
    examples: "Snoeiafval",
    sortOrder: 17,
    sourceRef: "Materiaalstromen!A24",
  },
] as const;

export type StreamCode = (typeof MATERIAL_STREAMS)[number]["code"];
export const CHEMICAL_STREAM_CODE: StreamCode = "M12";

export const CONDITIONS = [
  "GOOD",
  "LIGHT_DAMAGE",
  "DAMAGED",
  "CONTAMINATED",
  "UNKNOWN",
] as const;
export type Condition = (typeof CONDITIONS)[number];
export const CONDITION_LABELS: Record<Condition, string> = {
  GOOD: "Goed",
  LIGHT_DAMAGE: "Licht beschadigd",
  DAMAGED: "Beschadigd",
  CONTAMINATED: "Vervuild",
  UNKNOWN: "Onbekend",
};

export const TRI_STATE = ["YES", "NO", "DOUBT"] as const;
export type TriState = (typeof TRI_STATE)[number];
export const TRI_STATE_LABELS: Record<TriState, string> = {
  YES: "Ja",
  NO: "Nee",
  DOUBT: "Twijfel",
};

export const RETURN_CONFIRMED = ["YES", "NO", "CHECK", "NA"] as const;
export type ReturnConfirmed = (typeof RETURN_CONFIRMED)[number];
export const RETURN_CONFIRMED_LABELS: Record<ReturnConfirmed, string> = {
  YES: "Ja",
  NO: "Nee",
  CHECK: "Nog controleren",
  NA: "n.v.t.",
};

export const RECYCLABLE = ["YES", "NO", "CHECK"] as const;
export type Recyclable = (typeof RECYCLABLE)[number];
export const RECYCLABLE_LABELS: Record<Recyclable, string> = {
  YES: "Ja",
  NO: "Nee",
  CHECK: "Nog controleren",
};

export const EVALUATION_GROUPS = [
  {
    code: "E01",
    label: "BSA / bedrijfsafval",
    sortOrder: 1,
    sourceRef: "Evaluatie!A9",
  },
  {
    code: "E02",
    label: "Hout",
    sortOrder: 2,
    sourceRef: "Evaluatie!A10",
  },
  {
    code: "E03",
    label: "Minerale stromen (incl. beton/restbeton)",
    sortOrder: 3,
    sourceRef: "Evaluatie!A11",
  },
  {
    code: "E04",
    label: "Gips / lijmblokken",
    sortOrder: 4,
    sourceRef: "Evaluatie!A12",
  },
  {
    code: "E05",
    label: "Isolatie",
    sortOrder: 5,
    sourceRef: "Evaluatie!A13",
  },
  {
    code: "E06",
    label: "Kunststoffen / verpakking",
    sortOrder: 6,
    sourceRef: "Evaluatie!A14",
  },
  {
    code: "E07",
    label: "Metaal",
    sortOrder: 7,
    sourceRef: "Evaluatie!A15",
  },
  {
    code: "E08",
    label: "Overig",
    sortOrder: 8,
    sourceRef: "Evaluatie!A16",
  },
] as const;

export type EvaluationGroupCode = (typeof EVALUATION_GROUPS)[number]["code"];

export const VALIDATION_SCORES = [1, 2, 3, 4, 5] as const;
export type ValidationScore = (typeof VALIDATION_SCORES)[number];

export const YES_PARTIAL_NO = ["YES", "PARTIAL", "NO"] as const;
export type YesPartialNo = (typeof YES_PARTIAL_NO)[number];
export const YES_PARTIAL_NO_LABELS: Record<YesPartialNo, string> = {
  YES: "Ja",
  PARTIAL: "Deels",
  NO: "Nee",
};

export const EVALUATION_QUESTIONS = [
  {
    key: "attentionStream" as const,
    label: "Welke afval-/reststroom vroeg de meeste aandacht?",
  },
  {
    key: "workedWell" as const,
    label: "Welke maatregel of afspraak werkte goed?",
  },
  {
    key: "didNotWork" as const,
    label: "Wat werkte niet of was niet praktisch?",
  },
  {
    key: "nextProjectChange" as const,
    label: "Wat moet bij een volgend project anders?",
  },
];

export const PROJECT_START_STEPS = [
  "Projectgegevens en verantwoordelijke vastleggen",
  "Quickscan vóór/bij uitvoering",
  "Alleen werkelijk vrijkomende stromen registreren",
  "Zo nodig materiaalbeoordeling",
  "Na afloop evalueren en relevante gecontroleerde informatie handmatig doorgeven aan KAM",
] as const;

export const DECISION_ORDER = [
  "Voorkomen",
  "Hergebruik",
  "Retour/terugname",
  "Recycling/verwerking",
  "BSA/specifieke route",
] as const;

export const TEXT_SHORT_MAX = 200;
export const TEXT_LONG_MAX = 4000;
