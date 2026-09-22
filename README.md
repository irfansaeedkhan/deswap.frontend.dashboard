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
| Admin | `admin@deswap.co` | `Admin@1234` |

With `DEMO_MODE=true`, all `/api/*` data calls are rewritten to `/api/demo/handle/*` (no MongoDB). Use the bottom **User / Admin** switcher on dashboards to flip roles.

Demo login: `POST /api/demo/login` · Admin: `POST /api/demo/admin-login` · Switch: `POST /api/demo/switch-role`  
Mock lists: `GET /api/mock/packs?page=1&limit=10`

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

Latest local production run (`yarn build && yarn start`):

| Category | Score |
|----------|------:|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Measure on `yarn start`, not `yarn run dev`. CTA contrast uses `#D63C4C` so white text meets WCAG AA. Dashboard CSS is loaded only on dashboard routes.
