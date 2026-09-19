# Deswap Dashboard Frontend

DeFi / money-markets liquidity protocol dashboard built on Polygon. Landing pages, user dashboard, admin panel, and NFT marketplace UI.

## Stack

- **Next.js 16** (Pages Router) + **React 19**
- **SCSS** + Bootstrap 5 (no Tailwind)
- **Redux** (`next-redux-wrapper`) + axios
- **Yarn** package manager
- Node **>=20.9 <25** (see `.nvmrc`)

## Scripts

```bash
yarn install
yarn dev      # http://localhost:3000
yarn build   # production build (webpack)
yarn start   # serve production build
yarn lint
yarn lighthouse  # requires server on :3000
```

## Environment

1. Copy `.env.example` → `.env.local`
2. For local demo without Mongo/Redis:

```env
DEMO_MODE=true
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_PLATFORM_URL=http://localhost:3000
PLATFORM_URL=http://localhost:3000
```

**Never commit `.env` / `.env.local`** (secrets). Use `.env.example` only.

### Demo credentials

| Role | Email | Password |
|------|-------|----------|
| User | `demo@deswap.co` | `Demo@1234` |

Demo login: `POST /api/demo/login`  
Mock lists (paginated): `GET /api/mock/packs?page=1&limit=10` (also `networkrewards`, `companies`, `nfts`, `dashboard`)

## App structure

```
pages/           # Routes (landing, user, admin, market, api)
components/      # UI (landing, dashboards, marketplace)
layout/          # Page layouts
styles/          # SCSS (do not replace with Tailwind)
lib/mock-data.js # Demo fixtures
redux/           # Store + reducers
utils/           # Auth, axios, wallet helpers
public/          # Static assets
```

## Priority routes

- `/` — landing
- `/user/login` · `/user/register`
- `/user/dashboard` · `/user/dashboard/buydswap` · `/user/dashboard/network`
- `/market` · `/tokenomics` · `/about`

## Deploy

Set `PLATFORM_URL` / `NEXT_PUBLIC_PLATFORM_URL` to your host. Contact: `NEXT_PUBLIC_CONTACT_EMAIL` (default `info@deswap.co`).

Production build must pass before push:

```bash
yarn build && yarn start
```

## Lighthouse (desktop, `/`)

Latest local run after hardening:

| Category | Score |
|----------|------:|
| Performance | 98 |
| Accessibility | 93 |
| Best Practices | 96 |
| SEO | 100 |

Remaining gaps (intentional / constrained): active-nav color contrast `#e44757` on `#222` (SCSS left unchanged per project rules); Bootstrap unused CSS/JS; some PNGs not WebP sources.
