# Aannames en TODO's

## IMPLEMENTATIE-AANNAMES

| ID | Samenvatting | Gevolg |
|---|---|---|
| A01 | Projectnaam + scanverantwoordelijke verplicht bij aanmaken | Overige R01-velden mogen leeg (null) |
| A02 | Bij Nee op stroom details behouden, tonen als inactief | Geen stil gegevensverlies; uitgesloten van actieve overzichten |
| A03 | Definitieve beoordelingsroutes = vijf expliciete routes; leeg = nog open | Zie `docs/decisions/C01-final-route.md` |
| A04 | Optionele koppeling beoordeling↔stroom; expliciete route-overname | Geen automatische sync bij meerdere beoordelingen |
| A05 | Eén ProductValidation-record per lokale installatie | Geen multi-reviewer dashboard |
| A06 | Incomplete antwoorden = null; nooit auto-Nee/n.v.t./score 1 | Conditionele fouten alleen bij inconsistente opslag |
| A07 | Hoeveelheid ≥0 finite decimal; NL komma; date-only; tekstlimieten 200/4000 | Gedocumenteerd als technische keuze |
| A08 | Eén lokale beheerder, meerdere projecten, geen portfoliodashboard | `/projects` is minimale lijst |
| A09 | Voorlopige tokens `#1C7CB8`, `#1C1C1C`, `#FFFFFF`, `#F5F7F9`, `#222222` | Geen officiële Waal-specificatie |
| A10 | Next.js App Router + TS + Tailwind + Prisma SQLite + Zod + Vitest + Playwright | npm als package manager |
| A11 | Eén lokale admin via setup-commando; HttpOnly sessiecookie | Geen SSO/rollenmatrix |

## TODO (opdrachtgever / begeleider)

1. **TODO-C01:** Bevestigen definitieve assessment-routelijst (A03).
2. **TODO-dup:** Bevestigen of projectnummers uniek moeten zijn.
3. **TODO-brand:** Officiële huisstijl en hoogwaardige logoasset aanleveren; Excel + logo in `reference/`.
4. **TODO-val-multi:** Bevestigen of meerdere validatierespondenten nodig zijn.
5. **TODO-deploy:** Hosting, HTTPS, accounts, privacy/bewaartermijn, backup bij echte ingebruikname.
6. **TODO-pg:** PostgreSQL indien multi-user productie gewenst.

## Buiten scope (bewust niet gebouwd)

Geen CO₂, circulariteitsscore, kosten, AI, leverancierscatalogus, automatische Excel-import/export, documentupload, notificaties, REMONDIS-API, deadlines, rollenmatrix, beheerportal, projectverwijdering/archivering.
EOF
