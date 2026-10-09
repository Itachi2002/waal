# Waal afval- en reststromen projectscan

Nederlandstalige webapp voor het afstudeerproject: inzicht in vrijkomende afval- en reststromen per woningbouwproject.

## Online (Vercel)

Koppel de GitHub-repo `Itachi2002/waal` aan Vercel (zie `docs/deploy.md`). Push naar `main` = nieuwe deploy.

Gegevens worden opgeslagen in **localStorage** van de browser.

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
| Deploy | Vercel |

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
