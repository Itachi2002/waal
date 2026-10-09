# Besluit — stack en beveiliging

## Stack (A10)

Gekozen: Next.js App Router, TypeScript, React, Tailwind, Prisma + SQLite, Vitest, Playwright, npm.

**Alternatieven niet gekozen:** Vite-SPA zonder servervalidatie; PostgreSQL (TODO voor productie); Docker (niet nodig voor lokaal MVP).

## Auth (A11)

- Eén lokale admin via `auth:setup`.
- Wachtwoorden: bcryptjs (12 rounds).
- Sessies: willekeurige opaque token, SHA-256-hash in DB, HttpOnly cookie `waal_session`, SameSite=Lax, Secure in production, TTL 7 dagen.
- CSRF: SameSite + Origin/Referer-controle op mutaties.
- Rate limit: max. 10 loginpogingen / 15 min per IP-hash (single-process).

Geen Waal-SSO, rollenmatrix of zelfregistratie in dit MVP.
