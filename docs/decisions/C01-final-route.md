# Besluit C01 — Definitieve route bij Materiaalbeoordeling

## Bronconflict

Excel Materiaalbeoordeling heeft overlappende dropdowns:

1. **F8:F17:** `Hergebruik, Retour, Recycling / verwerking, Specifieke afvalroute, BSA, Nog bepalen`
2. **F8:F18:** `Hergebruik, Retour / terugname, Recycling / verwerking, BSA / restafval, Specifieke afvalroute`

Voorwaardelijke opmaak verwijst nog naar `Nog bepalen`. De bron is daardoor niet eenduidig.

## Gekozen implementatie (A03)

- Gebruik de **tweede lijst** met vijf expliciete routes als enige opslagbare definitieve routes.
- Open beoordeling: `finalRoute = null`; UI toont placeholder **«Nog te bepalen»** (geen opslagbare enum).
- Canonical opslag:
  - `Retour` / `Retour / terugname` → `RETURN`
  - `BSA` / `BSA / restafval` → `RESIDUAL`
  - Overige: `REUSE`, `RECYCLE`, `SPECIFIC`
- Bronlabels per pagina behouden (assessment toont labels van lijst 2).
- `NEEDS_ASSESSMENT` en `MULTIPLE` zijn **niet** toegestaan als definitieve beoordelingsroute.

## Alternatief (niet gekozen)

Lijst 1 met `Nog bepalen` als opslagwaarde — verworpen omdat A03 open status als null modelleert en Excel zelf tegenstrijdig is.

## TODO

Bevestigen door opdrachtgever/begeleider voordat dit als definitieve bedrijfsregel geldt. Implementatie claimt **niet** dat Excel eenduidig is.
EOF
