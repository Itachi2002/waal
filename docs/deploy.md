# Online zetten via GitHub Pages

Live URL (na eerste succesvolle deploy):

**https://itachi2002.github.io/waal/**

## Architectuur

GitHub Pages host alleen statische bestanden. Daarom:

- Next.js `output: 'export'` met `basePath` `/waal`
- Gegevens in **localStorage** (per browser), geen server/SQLite online
- Geen login

Wissen van browserdata of andere browser = andere/lege data.

## Eenmalig in GitHub

1. Open https://github.com/Itachi2002/waal  
2. **Settings → Pages**  
3. **Source:** GitHub Actions  
4. Push naar `main` triggert [.github/workflows/pages.yml](../.github/workflows/pages.yml)

## Lokaal bouwen / previewen

```bash
npm install
npm run build
npx serve out
```

Open daarna de URL die `serve` toont. Let op: met `basePath` `/waal` moet je lokaal naar `/waal/` navigeren, of tijdelijk `basePath` uitzetten voor pure localhost-dev (`npm run dev` werkt zonder export).

## Ontwikkelen

```bash
npm run dev
```

Dev-server gebruikt dezelfde localStorage-store (geen API).
