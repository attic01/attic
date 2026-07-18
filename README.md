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

### 1. Clone & install

```bash
git clone <your-repo-url>
cd attic
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Fill in (from Supabase → Project Settings → API):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Optional — only if you use the migration script:

```bash
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres
```

Never commit `.env.local`, Google client secrets, or service-role keys. They are covered by `.gitignore`.

### 3. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. **Authentication → Providers → Google** — enable and add Client ID / Secret.
3. Add redirect URLs:
   - Supabase Auth callback: `https://YOUR_REF.supabase.co/auth/v1/callback`
   - App callback: `http://localhost:3000/auth/callback` (plus production URL later)
4. Site URL: `http://localhost:3000` for local work.
5. Apply the schema — either:
   - Paste `supabase/migrations/001_initial.sql` into the SQL Editor and run it, **or**
   - `DATABASE_URL="…" npm run db:migrate`

The migration creates tables (profiles, artists, albums, tracks, purchases, playlists, bulletin), RLS policies, and storage buckets:

| Bucket | Visibility |
|--------|------------|
| `cover-art` | Public |
| `artist-photos` | Public |
| `audio-previews` | Public |
| `audio-masters` | Private (owners / buyers) |

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Without** Supabase env vars, the UI still loads using sample data in `src/shared/data/sample.ts` — useful for layout and listener flows (artists, albums, tracks).

### Useful scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply `001_initial.sql` via `DATABASE_URL` |

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
