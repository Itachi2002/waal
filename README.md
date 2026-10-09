# Waal afval- en reststromen projectscan

Nederlandstalige lokale webapplicatie voor het afstudeerproject: inzicht in vrijkomende afval- en reststromen per woningbouwproject, ter ondersteuning van werkvoorbereiding en uitvoering.

## Doel en afbakening

- Eén scanverantwoordelijke houdt de scan bij; anderen leveren input.
- Geen financiële kostenberekening, geen REMONDIS-API of automatische synchronisatie.
- Vervangt het centrale afvaloverzicht van de KAM-coördinator niet; overdracht is handmatig.
- Geen CO₂-, circulariteits- of duurzaamheidsscores, geen AI-advies, geen documentupload/notificaties.
- `/validation` is eenmalige onderzoeksvalidatie van het beroepsproduct, geen projectscore.

Zie `docs/assumptions-and-todos.md` en `docs/source-map.md`.

## Stack (A10)

| Onderdeel | Keuze |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript + React 19 |
| Styling | Tailwind CSS 4 |
| ORM / DB | Prisma 6 + SQLite |
| Validatie | Zod-achtige domeinvalidatie (pure functies + services) |
| Tests | Vitest (unit/integratie), Playwright (e2e) |
| Auth | **Uit voor demo** — open toegang; optionele auth-code blijft in repo |

Exacte versies staan in `package-lock.json` na installatie.

## Prerequisites

- Node.js **20+** (aanbevolen 22)
- npm 10+

## Bronbestanden

Plaats lokaal (standaard niet in Git):

1. `reference/Waal_projectscan_VALIDATIE.xlsx`
2. Waal JPEG-logo → ook kopiëren naar `public/brand/waal-logo.jpeg`
3. Zet `NEXT_PUBLIC_HAS_WAAL_LOGO=true` in `.env` wanneer het logo aanwezig is

Zonder logo toont de UI de tekstplaceholder **Waal**. Zie `reference/README.md`.

## Installatie (schone clone)

```bash
cp .env.example .env
npm install
npm run db:migrate:dev   # of: npm run db:migrate
npm run db:seed          # broncatalogi (overschrijft geen projectdata)
npm run dev
```

Open http://localhost:3000 — **geen login**, je gaat direct naar projecten.

Online zetten: zie `docs/deploy.md` (Render/Railway; **niet** GitHub Pages).

### Demo-data (optioneel, synthetisch)

```bash
npm run db:seed:demo
```

Maakt/ververst alleen het gelabelde **Fictief demo-project** (`DEMO-001`). Wist geen andere projecten.

### Productiebuild lokaal

```bash
npm run build
npm start
```

## Scripts

| Script | Functie |
|---|---|
| `dev` | Ontwikkelserver |
| `build` / `start` | Productiebuild / server |
| `lint` / `typecheck` | Kwaliteit |
| `test` | Unit |
| `test:integration` | Integratie (tijdelijke DB) |
| `test:e2e` | Playwright |
| `db:migrate` / `db:migrate:dev` | Migraties |
| `db:seed` / `db:seed:demo` | Catalogus / demo |
| `auth:setup` | Optioneel (login is uitgeschakeld in de demo) |

## Routes

| Pad | Inhoud |
|---|---|
| `/login` | Redirect naar projecten (login uit) |
| `/projects` | Projectlijst |
| `/projects/new` | Nieuw project (R01) |
| `/projects/[id]/start` | Projectstart |
| `/projects/[id]/quickscan` | Quickscan |
| `/projects/[id]/streams` | Materiaalstromen |
| `/projects/[id]/assessments` | Materiaalbeoordeling |
| `/projects/[id]/evaluation` | Evaluatie |
| `/validation` | Onderzoeksvalidatie |

## Backup en herstel

- Databasebestand: pad uit `DATABASE_URL` (standaard `prisma/dev.db`).
- Backup: kopieer het `.db`-bestand terwijl de app gestopt is.
- Herstel: zet het bestand terug en start opnieuw.
- Reset **alleen** test/demo: verwijder testdatabase of herhaal `db:seed:demo`. Nooit productie-/gebruikers-DB willekeurig wissen.

## Beveiliging (demo)

- **Geen login** in deze demo-versie — iedereen met de URL kan lezen/schrijven.
- Mutaties: origincontrole + servervalidatie; geen mass assignment.
- Geen analytics/trackers.

**TODO bij echte ingebruikname:** login opnieuw inschakelen, HTTPS, accounts/rechten, privacy/bewaartermijn, backupbeleid.

## Documentatie

- `docs/source-map.md` — requirements ↔ implementatie ↔ tests
- `docs/data-model.md` — entiteiten en routes
- `docs/decisions/C01-final-route.md` — bronconflict definitieve route
- `docs/assumptions-and-todos.md`
- `docs/user-guide.md`
- `docs/test-plan.md`
- `docs/graduation-validation.md`
- `docs/decisions/stack-and-security.md`

## Git-werkwijze

Werk op branch `feature/waal-projectscan`. Commit alleen code/docs; geen `.env`, SQLite, of bedrijfsbronbestanden tenzij expliciet toegestaan.

## Bekende beperkingen

- Bron-Excel en logo ontbraken bij start; mapping volgt de specificatie (`SPEC`).
- Geen multi-user realtime samenwerking; revisionconflicten wel gesignaleerd.
- SQLite/lokaal MVP — PostgreSQL/deployment is TODO.
