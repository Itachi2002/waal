# Source-map — Waal afval- en reststromen projectscan

Labels: **BRON** (Excel/specificatie), **IMPLEMENTATIE-AANNAME**, **TODO**.

**Bronstatus:** `reference/Waal_projectscan_VALIDATIE.xlsx` ontbreekt bij start. Mapping volgt de Cursor-promptspecificatie. Status `SPEC` = geïmplementeerd op specificatie zonder directe Excel-vergelijking.

| ID | Bronblad/celbereik | Requirement | Implementatie | Test | Status |
|---|---|---|---|---|---|
| R01 | Projectstart!A16:H18 | Negen projectvelden | `Project` model + `/projects/[id]/start` | unit + e2e | SPEC |
| R01-steps | Projectstart!A9:B13 | Vijf werkinstructiestappen | Startpagina instructies | e2e visible | SPEC |
| R01-order | Projectstart!A21:H22 | Beslisvolgorde Voorkomen→…→BSA | Startpagina + docs | unit labels | SPEC |
| R02 | Projectquickscan!A7:E17 | Tien controlepunten | `QuickscanDefinition` Q01–Q10 + answers | catalogs + rules | SPEC |
| R02-nee | Projectquickscan!A5:E5 | Nee vereist vervolgactie | `lib/validation/quickscan.ts` | unit | SPEC |
| R03 | Materiaalstromen!A7:H24 | 17 groepen + velden | catalogs M01–M17 + streams page | catalogs + rules | SPEC |
| R03-cause | Materiaalstromen!A27:H28 | Oorzaaklegenda O1–O8 | catalogs + UI | unit | SPEC |
| R03-chem | Materiaalstromen chemisch | Alleen Specifieke afvalroute | `route-rules.ts` | unit | SPEC |
| A02 | — | Nee bewaart details inactief | `occurs=NO` behoudt velden | unit/integration | IMPLEMENTATIE-AANNAME |
| R04 | Materiaalbeoordeling!A7:I18 | Beoordelingsvelden | `MaterialAssessment` | unit + e2e | SPEC |
| C01/A03 | Materiaalbeoordeling!F8:F18 | Overlappende routelijsten | `docs/decisions/C01-final-route.md` | unit A03 | IMPLEMENTATIE-AANNAME |
| A04 | — | Optionele koppeling stroom; geen auto-overname | assessments service | integration | IMPLEMENTATIE-AANNAME |
| R05 | Evaluatie!A8:F16 | Acht groepen + kolommen | E01–E08 + evaluation page | catalogs | SPEC |
| R05-q | Evaluatie!A20:B23 | Vier leerpuntvragen | `ProjectEvaluation` | e2e | SPEC |
| R06 | Validatie!A6:F12 | Onderzoeksformulier 13 velden | `/validation` singleton | unit + e2e | SPEC |
| A05 | — | Eén validatierecord per installatie | `ProductValidation` singleton | integration | IMPLEMENTATIE-AANNAME |
| A06 | — | Incomplete formulieren met null | Zod schemas allow null | unit | IMPLEMENTATIE-AANNAME |
| A07 | — | Decimaal, data, limieten | `lib/validation/*` | unit | IMPLEMENTATIE-AANNAME |
| A01 | — | name + scanResponsible verplicht | project create schema | unit | IMPLEMENTATIE-AANNAME |
| A08 | — | Projectlijst minimale voorziening | `/projects` | e2e | IMPLEMENTATIE-AANNAME |
| A09 | — | Voorlopige kleurtokens | CSS variables | visual | IMPLEMENTATIE-AANNAME |
| A10 | — | Next.js/Prisma/SQLite stack | package.json | CI | IMPLEMENTATIE-AANNAME |
| A11 | — | Lokale single-admin login | Lucia-achtige sessies | auth tests | IMPLEMENTATIE-AANNAME |
| BOUND | Projectstart!D9:H13, Validatie!A15:F15 | Harde afbakening | README + user-guide | docs review | SPEC |
| TODO-dup | — | Unieke projectnummers | niet afgedwongen | — | TODO |
| TODO-brand | — | Officiële huisstijl/logo | placeholder tekst | — | TODO |
| TODO-val-multi | — | Meerdere validatierespondenten | singleton A05 | — | TODO |
| TODO-pg | — | PostgreSQL/deployment | SQLite MVP | — | TODO |
| TODO-c01 | — | C01 bevestigen opdrachtgever | A03 gekozen | — | TODO |
EOF
