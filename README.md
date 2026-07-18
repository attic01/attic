# Attic

**Attic** is a curated online record store and personal music library for independent artists and listeners.

It is not a big streaming algorithm. It is meant to feel like a small record shop and listening room: discover music by taste, buy it directly, and keep it in your own space — **My Attic**. Artists work in **Studio**, a workshop for profiles and releases.

Everything runs on **Supabase** (Auth, Postgres, Storage). There is **no custom backend**.

---

## In a nutshell

| | |
|---|---|
| **What** | Curated indie record shop + personal library |
| **Who** | Listeners (buy & collect) · Artists (publish & manage) |
| **How** | Next.js app + Supabase (Google sign-in, DB, storage) |
| **Money** | Pay-what-you-want with a floor price per album |
| **Dev mode** | Works with mock catalogue data even without Supabase |

**Listener path:** Shop / Artists → album → buy → My Attic → listen  
**Artist path:** Studio → profile (Face) · releases (Pressing) · shop window (publish)

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) + React 19 |
| Language | TypeScript |
| Backend | [Supabase](https://supabase.com/) — Auth, Postgres, Storage, RLS |
| Auth | Google OAuth (role chosen before sign-in: Listener or Artist) |
| Styling | Global CSS in `src/styles/` (no Tailwind) — Fraunces + Source Sans 3 |
| Architecture | Feature modules under `src/features/*`; routes stay thin in `src/app/` |
| Tooling | ESLint, Turbopack (`npm run dev`), optional `pg` migration script |

---

## Roles & main routes

| Role | Home | Can do |
|------|------|--------|
| **Listener** | `/my-attic` | Browse, open artists & albums, purchase, collect, play |
| **Artist** | `/studio` | Edit profile, create releases, put work “in the window” |

| Path | What it is |
|------|------------|
| `/` | Landing |
| `/catalogue` | Shop — browse releases |
| `/artists` | Artist directory |
| `/artists/[slug]` | Artist page — all albums on the shelf |
| `/albums/[slug]` | Album detail — tracks, buy, more from artist |
| `/bulletin` | Noticeboard |
| `/my-attic` | Personal library (owned music) |
| `/studio` | Artist shop window + bench |
| `/studio/profile` | Face — public profile form |
| `/studio/releases` | Pressing — create / manage releases |
| `/auth/sign-in` | Role pick + Google sign-in |
| `/auth/callback` | OAuth callback |

Nav is role-aware: artists see **Studio** first; everyone shares Shop · Artists · Bulletin · My Attic.

---

## Folder structure

```
attic/
├── src/
│   ├── app/                      # Routes only (pages + auth callback)
│   │   ├── page.tsx              # Landing
│   │   ├── catalogue/
│   │   ├── artists/[slug]/
│   │   ├── albums/[slug]/
│   │   ├── bulletin/
│   │   ├── my-attic/
│   │   ├── studio/               # Window, profile, releases
│   │   ├── auth/sign-in/
│   │   └── auth/callback/
│   ├── features/                 # Domain logic + UI by feature
│   │   ├── auth/                 # Google sign-in, session, role
│   │   ├── catalogue/            # Browse / query albums & artists
│   │   ├── artists/              # Artist cards
│   │   ├── albums/               # Track list
│   │   ├── commerce/             # Purchase (pay-what-you-want)
│   │   ├── my-attic/             # Owned library
│   │   ├── artist-studio/        # Studio bench, forms, previews
│   │   ├── bulletin/             # Noticeboard UI
│   │   └── player/               # Global player bar
│   ├── shared/
│   │   ├── components/           # AppShell, SiteHeader, …
│   │   ├── data/sample.ts        # Mock artists, albums, tracks
│   │   ├── lib/supabase/         # Browser / server / middleware clients
│   │   └── types/                # Shared DB types
│   ├── styles/                   # Feature CSS (landing, auth, studio, …)
│   └── middleware.ts             # Auth session refresh
├── supabase/
│   ├── migrations/001_initial.sql
│   └── config.toml
├── scripts/
│   └── apply-migration.js        # Optional: apply SQL via DATABASE_URL
├── .env.example                  # Safe template (commit this)
├── .env.local                    # Your secrets (gitignored)
└── gcp_secret_details/           # Google OAuth JSON (gitignored)
```

**Rule of thumb:** put UI and queries in `src/features/<name>/`; keep `src/app/` as thin route wrappers.

---

## Setup

### Supabase libraries (what we installed)

These are the packages Attic uses to talk to Supabase. They are already listed in `package.json`; a normal `npm install` pulls them in.

| Package | Where | Why |
|---------|-------|-----|
| [`@supabase/supabase-js`](https://www.npmjs.com/package/@supabase/supabase-js) | dependency | Core Supabase client (Auth, DB, Storage) |
| [`@supabase/ssr`](https://www.npmjs.com/package/@supabase/ssr) | dependency | Cookie-aware clients for Next.js App Router (browser, server, middleware) |
| [`pg`](https://www.npmjs.com/package/pg) | devDependency | Node Postgres driver used only by `npm run db:migrate` |

**Install commands (if starting from scratch or adding them alone):**

```bash
# App dependencies (already in package.json)
npm install @supabase/supabase-js @supabase/ssr

# Migration helper only (already in package.json as a devDependency)
npm install -D pg
```

**Where they are used in code:**

| File | Library API |
|------|-------------|
| `src/shared/lib/supabase/client.ts` | `createBrowserClient` from `@supabase/ssr` |
| `src/shared/lib/supabase/server.ts` | `createServerClient` from `@supabase/ssr` |
| `src/shared/lib/supabase/middleware.ts` | `createServerClient` from `@supabase/ssr` |
| `scripts/apply-migration.js` | `pg` (`Client`) |

We did **not** use the Supabase CLI (`npx supabase …`) for day-to-day setup. Schema lives in SQL and is applied via the Dashboard SQL Editor or `npm run db:migrate`.

---

### 1. Clone & install everything

```bash
git clone <your-repo-url>
cd attic
npm install
```

That installs Next.js, React, `@supabase/supabase-js`, `@supabase/ssr`, `pg`, TypeScript, ESLint, etc.

---

### 2. Environment files

```bash
cp .env.example .env.local
```

Edit `.env.local` (Supabase → **Project Settings → API**):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Optional — only needed to run the migration script from the terminal:

```bash
# Direct connection (Dashboard → Project Settings → Database → URI)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres

# If direct host fails, use the Session pooler URI from the same page instead, e.g.:
# DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
```

Never commit `.env.local`, Google client secrets, or service-role keys. They are covered by `.gitignore`.

---

### 3. Create & configure the Supabase project (Dashboard)

These steps are in the [Supabase Dashboard](https://supabase.com/dashboard) (not CLI commands):

1. **New project** at [supabase.com](https://supabase.com) — note the project ref (subdomain of `*.supabase.co`).
2. **Authentication → URL configuration**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback` (add production URLs later)
3. **Authentication → Providers → Google** — enable
   - Client ID / Client Secret from Google Cloud OAuth
   - Google authorized redirect URI must include:  
     `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. Copy **Project URL** + **anon public** key into `.env.local` (step 2).

---

### 4. Apply the database schema

Schema file: `supabase/migrations/001_initial.sql`  
Creates: `profiles`, `artists`, `albums`, `tracks`, `purchases`, `playlists`, `playlist_tracks`, `bulletin_posts`, plus RLS, auth trigger, and storage buckets.

**Option A — Dashboard (simplest)**

1. Open SQL Editor for your project  
2. Paste contents of `supabase/migrations/001_initial.sql`  
3. Run  

**Option B — terminal (uses `pg` + our script)**

```bash
# Install pg if somehow missing
npm install -D pg

# Apply migration (password from Dashboard → Database)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres" \
  npm run db:migrate
```

That runs: `node scripts/apply-migration.js` and prints the public tables when done.

**Storage buckets created by the migration:**

| Bucket | Visibility |
|--------|------------|
| `cover-art` | Public |
| `artist-photos` | Public |
| `audio-previews` | Public |
| `audio-masters` | Private (owners / buyers) |

**Optional — verify tables via REST (anon key):**

```bash
curl -sS \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  "https://YOUR_PROJECT_REF.supabase.co/rest/v1/profiles?select=id&limit=1"
```

Empty array `[]` or HTTP 200 means the table exists. HTTP 404 / “relation does not exist” means the migration has not been applied yet.

---

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Without** Supabase env vars, the UI still loads using sample data in `src/shared/data/sample.ts` — useful for layout and listener flows (artists, albums, tracks).

---

### Full command checklist (copy-paste)

```bash
# 1) Project deps (includes Supabase libraries)
git clone <your-repo-url>
cd attic
npm install

# Same libraries, if you ever need to add them explicitly:
# npm install @supabase/supabase-js @supabase/ssr
# npm install -D pg

# 2) Env
cp .env.example .env.local
# → fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3) Schema (after creating the Supabase project + Google provider in the Dashboard)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres" \
  npm run db:migrate

# 4) Dev server
npm run dev
```

---

### Useful scripts

| Command | Purpose |
|---------|---------|
| `npm install` | Install all deps including `@supabase/*` and `pg` |
| `npm install @supabase/supabase-js @supabase/ssr` | Add Supabase client libs only |
| `npm install -D pg` | Add Postgres driver for migrations only |
| `npm run db:migrate` | Apply `001_initial.sql` via `DATABASE_URL` (`pg`) |
| `npm run dev` | Local dev (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

---

## Progress so far

### Done

- [x] Project scaffold (Next.js App Router, TypeScript, feature folders)
- [x] Supabase clients (browser / server / middleware) + Google OAuth flow
- [x] Role selection before sign-in (Listener vs Artist)
- [x] Full initial schema + RLS + storage buckets
- [x] Landing page and shared chrome (header, shell)
- [x] **Shop** (`/catalogue`) and **Artists** directory
- [x] **Artist pages** with all albums on a shelf (mock data)
- [x] **Album pages** — cover, facts, tracks, purchase CTA, “more from artist”
- [x] **My Attic** shell for owned library
- [x] **Studio** as workshop metaphor — Window (public shelf) + Bench (Face / Pressing)
- [x] Artist profile & release forms with live previews
- [x] Bulletin page shell
- [x] Global player bar (UI)
- [x] Sample catalogue (multiple artists, albums, full track lists)
- [x] Strict `.gitignore` for env files and OAuth / credential JSON

### In progress / partial

- [ ] Purchases against real DB (sample IDs still partly mock)
- [ ] Real cover art & audio uploads wired end-to-end
- [ ] Full playback of masters for owners; previews for everyone else
- [ ] Playlists create / share / download
- [ ] Bulletin posts backed by live data
- [ ] Production deploy + production OAuth redirect URLs

### Product vision (later)

From the original idea doc: editorial curation, high-quality downloads, playlist sharing, and a quiet intimate feel — personal record shop, not a mega-streamer.

---

## Design notes

- Warm cream / brown / terracotta palette; expressive serif + humanist sans
- Icons and short labels over long copy where possible
- Studio feels like a shop window and workbench, not an admin CMS
- Prefer one clear job per section; keep listener flow: artist → shelf → album → buy / listen

---

## Security reminder

Do **not** commit:

- `.env.local` or any real `.env*`
- `gcp_secret_details/` or Google `client_secret*.json`
- Service-role keys, database passwords, private keys

Use `.env.example` as the only committed env template.

---

## Quick start (already have Supabase?)

```bash
npm install
cp .env.example .env.local   # fill URL + anon key
npm run dev
```

Then open `/artists/mira-han` → click a sleeve → album detail to walk the listener flow with mock data.
