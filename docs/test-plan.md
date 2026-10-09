# Testplan

## Unit (`npm run test`)

- Catalogi: 14 vragen? Nee — 10 quickscan, 17 stromen, 8 evaluatiegroepen.
- Scores, enums, Nee-actie, retourregel, chemisch, null vs nul, decimalen, C01/A03, contextroutes.

## Integratie (`npm run test:integration`)

- Tijdelijke SQLite (`prisma/test-integration.db`).
- Atomair projectaanmaken, revisionconflict, gekoppelde beoordeling.

## E2E (`npm run test:e2e`)

Vereist gebouwde app, gemigreerde DB, synthetische login (`E2E_USER` / `E2E_PASSWORD`).

- Flow A: project → quickscan Nee-fout → actie → reload.
- Flow B/C: Nog beoordelen → retour geweigerd → bevestigd → overname; chemisch SPECIFIC.
- Flow D/E: evaluatie + validatie zonder totaalscore.
- Mobiel 375px navigatie.

## CI

`.github/workflows/ci.yml`: install, migrate, seed, auth:setup, lint, typecheck, unit, integration, build, playwright chromium.
