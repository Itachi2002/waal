# Online zetten via Vercel

Gegevens blijven in **localStorage** van de browser (geen serverdatabase). Geen login.

## Koppelen (eenmalig)

1. Ga naar [vercel.com](https://vercel.com) en log in (GitHub).
2. **Add New Project** → importeer `Itachi2002/waal`.
3. Framework: Next.js (automatisch). Geen env-vars nodig.
4. Deploy.

Elke push naar `main` triggert een nieuwe deploy.

## Lokaal

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Static build preview

```bash
npm run build
npx serve out
```

## CLI (optioneel)

```bash
npx vercel login
npx vercel --prod
```
