# Online zetten (demo zonder login)

## Waarom niet GitHub Pages?

GitHub Pages serveert **alleen statische bestanden** (HTML/CSS/JS). Deze app heeft nog steeds:

- een Next.js **Node-server** (API-routes, server components)
- **Prisma + SQLite** voor opslag

Zonder login wordt deploy **eenvoudiger**, maar Pages blijft **ongeschikt**: er is geen Node-runtime en geen werkende database. Een static export zou opslaan en projecten breken.

## Aanbevolen: Render of Railway

Beide kunnen `npm start` draaien. Er is **geen** `auth:setup` of login nodig.

### Render — Web Service

1. Ga naar [render.com](https://render.com) en koppel GitHub-repo **Itachi2002/waal**.
2. Nieuwe **Web Service**, branch `main`.
3. **Build command:**

```bash
npm ci && npx prisma generate && npx prisma migrate deploy && npm run db:seed && npm run build
```

4. **Start command:**

```bash
npm run start
```

5. **Environment variables:**

| Key | Waarde |
|---|---|
| `DATABASE_URL` | `file:./data/prod.db` |
| `NODE_VERSION` | `22` |

`AUTH_SECRET` / login zijn niet nodig voor deze demo.

6. Optioneel: `npm run db:seed:demo` in de build toevoegen voor het fictieve demo-project.

7. Open de Render-URL → je komt direct op `/projects`.

**Let op:** zonder persistent disk verdwijnt SQLite bij herstarts. Voor een afstudeerdemo vaak acceptabel; voor blijvende data: disk/volume of later PostgreSQL.

### Railway

New Project → Deploy from GitHub →zelfde build/start en `DATABASE_URL`. Volume koppelen als je data wilt bewaren.

## Lokaal (zonder login)

```bash
cp .env.example .env
npm install
npm run db:migrate:dev
npm run db:seed
npm run dev
```

Open http://localhost:3000 — geen inloggen.
