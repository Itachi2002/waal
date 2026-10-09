# Waal afval- en reststromen projectscan

Nederlandstalige webapp voor het afstudeerproject: inzicht in vrijkomende afval- en reststromen per woningbouwproject.

## Online (GitHub Pages)

**https://itachi2002.github.io/waal/**

Eenmalig in de repo: **Settings → Pages → Source = GitHub Actions**.

Gegevens worden opgeslagen in **localStorage** van de browser (geen serverdatabase op Pages). Zie `docs/deploy.md`.

## Doel en afbakening

- Geen financiële kostenberekening, geen REMONDIS-API.
- Geen CO₂-/circulariteitsscores, geen documentupload/notificaties.
- `/validation` is onderzoeksvalidatie van het beroepsproduct, geen projectscore.

## Stack

| Onderdeel | Keuze |
|---|---|
| Framework | Next.js 15 (static export) + TypeScript + React 19 |
| Styling | Tailwind CSS 4 |
| Opslag (online) | localStorage |
| Validatie | Domeinregels in `lib/validation` |
| Tests | Vitest (unit) |
| Deploy | GitHub Actions → GitHub Pages |

## Lokaal starten

```bash
npm install
npm run dev
```

Open http://localhost:3000 — geen login.

### Static build preview

```bash
npm run build
npx serve out
```

Navigeer naar het pad `/waal/` (basePath).

## Routes

| Pad | Inhoud |
|---|---|
| `/projects/` | Projectlijst |
| `/projects/new/` | Nieuw project |
| `/projects/start/?id=` | Projectstart |
| `/projects/quickscan/?id=` | Quickscan |
| `/projects/streams/?id=` | Materiaalstromen |
| `/projects/assessments/?id=` | Materiaalbeoordeling |
| `/projects/evaluation/?id=` | Evaluatie |
| `/validation/` | Onderzoeksvalidatie |

## Documentatie

- `docs/deploy.md` — GitHub Pages
- `docs/source-map.md` — requirements
- `docs/user-guide.md` — gebruik
