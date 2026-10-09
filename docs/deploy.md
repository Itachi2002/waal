# Online zetten

## Waarom niet GitHub Pages?

GitHub Pages serveert **alleen statische bestanden** (HTML/CSS/JS). Deze app heeft:

- Next.js server / API-routes
- login met sessiecookies
- Prisma + SQLite-database

Daardoor werkt een echte deploy **niet** op `*.github.io`. Een static export zou login, opslaan en database breken.

## Aanbevolen: Render of Railway (gratis starters)

Beide kunnen `npm start` draaien (Node-server).

### Render — Web Service

1. Ga naar [render.com](https://render.com) en koppel GitHub-repo `Itachi2002/waal`.
2. Nieuwe **Web Service**, branch `main`.
3. Build command:

```bash
npm ci && npx prisma generate && npx prisma migrate deploy && npm run db:seed && npm run build
```

4. Start command:

```bash
npm run start
```

5. Environment variables:

| Key | Waarde |
|---|---|
| `DATABASE_URL` | `file:./data/prod.db` |
| `AUTH_SECRET` | lange willekeurige string |
| `NODE_ENV` | `production` |

6. Na eerste deploy: open de Render-shell of gebruik een one-off job:

```bash
AUTH_USERNAME=admin AUTH_PASSWORD='jouw-wachtwoord' npm run auth:setup
```

**Let op:** zonder persistent disk verdwijnt SQLite bij herstarts. Voor een demo is dat vaak acceptabel; voor blijvende data: persistent disk toevoegen of later PostgreSQL (TODO).

### Railway

Vergelijkbaar: New Project → Deploy from GitHub → zelfde build/start en env vars. Voeg een volume toe op het pad van je databasebestand als je data wilt bewaren.

## Alternatief: Vercel

Vercel is uitstekend voor Next.js, maar **SQLite-bestand is daar onbetrouwbaar** (ephemeral filesystem). Alleen gebruiken na migratie naar Postgres/Turso.

## Lokaal blijft de bron van waarheid voor MVP

```bash
npm run dev
```

Online is voor demo/deling; productie bij Waal vraagt nog HTTPS, accounts, backup en privacy (zie aannames/TODO’s).
