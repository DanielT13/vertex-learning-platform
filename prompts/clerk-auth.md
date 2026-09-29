# Implementation Prompt — Add Clerk Authentication (Vertex)

## Goal
Set up Clerk authentication in the existing Vertex Next.js App Router project (`C:\Users\HP\Desktop\vertex`), linked to Clerk application `app_3JzvEzwhKKhY22j6Y0DUCFlDH6I`, with visible sign-in / sign-up / signed-in controls integrated into the existing `SiteHeader`, and verified via `clerk doctor` + app start + auth flow test.

Do not build anything beyond AGENTS.md §1 scope: no Organizations, billing, progress writes, or route gating beyond what Clerk init provides. Browsing stays public.

## Skills read
- `clerk` (router — version detection, task routing; defaults to current SDK since no Clerk packages installed yet).
- `clerk-setup` (existing-project `init` flow, `--app` branch, accountless keys note, visible auth controls with `<Show>`, `doctor` verify, shadcn branch, critical rules: `await auth()` on Next 15+, `ClerkProvider` inside `<body>`, never expose `CLERK_SECRET_KEY`).

Supporting (per AGENTS.md §4):
- `node_modules/next/dist/docs/` for App Router routing + server/client boundaries (layout `ClerkProvider` placement, `middleware.ts` vs `proxy.ts` on Next 16).
- Package docs for `@clerk/nextjs` + existing Tailwind/component patterns (reuse, no restyle).

## Code / config inspected
- `package.json`: `next@16.3.7`, `react@19.2.8`, no `@clerk/*`, no `components.json` (no shadcn branch), `package-lock.json` present → package manager is `npm`. Scripts: `dev`, `build`, `start`, `lint` only (no typecheck script; use `npx tsc --noEmit`).
- `app/layout.tsx:22-30`: `RootLayout` returns `<html><body>` with fonts; no `ClerkProvider` yet. This is where provider goes — inside `<body>`, not wrapping `<html>`.
- `app/page.tsx:1-13`: Home is presentational Server Component, no auth.
- `components/site-header.tsx:8-46`: Presentational Server Component header with Courses / My Learning nav + bell + placeholder avatar (`User` icon in `span`). This is the integration point for auth controls — replace/augment placeholder avatar, keep layout/spacing/typography exact, reuse Tailwind patterns.
- `components/ui/`: `badge, breadcrumb, button, card, input, logo, progress, status` — reuse before adding new components.
- Root globs: no `middleware.ts`, no `proxy.ts`, no `components.json`. Next version is 16.x, so verify whether `clerk init` emits `proxy.ts` (Next 16 canonical) or `middleware.ts`, and apply matcher fix to whichever exists.
- `next.config.ts`: minimal, no auth-related config.
- `prompts/`: existing prompt files present; this prompt follows AGENTS.md §2 step 4.
- Did NOT read any `.env*` files per critical rule.

## Decisions / assumptions
- Existing project (not empty) → use `clerk init --app app_3JzvEzwhKKhY22j6Y0DUCFlDH6I` from project root. Do NOT pass `--framework`/`--pm` unless CLI asks (detection should yield Next.js + npm). User task explicitly pins `--app`; `clerk-setup` optional-branch confirms this is correct when user supplies an app ID.
- CLI invocation: user task uses global `clerk` binary (`command -v clerk && clerk --version` → `clerk update --yes` or `npm install -g clerk`). Prefer that over `npx -y clerk@latest` to match user's requested flow. Both are equivalent; follow user's Steps 1–3 verbatim.
- `clerk auth login` is first command after install/update, before `apps list` or `init`. Pause for user to complete browser login flow if needed. If already signed in, continue.
- Next.js matcher: after init, ensure `config.matcher` includes `'/(api|trpc)(.*)'` then `'/__clerk/:path*'` exactly once. Add only if missing. Apply to `proxy.ts` if created (Next 16), else `middleware.ts`.
- Auth controls: Next.js App Router pattern from task Step 6: `SignInButton, SignUpButton, Show, UserButton` from `@clerk/nextjs`. Render sign-in/up when signed-out, `UserButton` when signed-in, inside `SiteHeader` right-side cluster (replace placeholder avatar span, keep bell + responsive mobile nav unchanged). `SiteHeader` is currently a Server Component — Clerk buttons require client boundary; wrap only the auth cluster in a small Client Component (e.g. `components/auth-controls.tsx` with `"use client"`) imported by `SiteHeader`, preserving server status of the rest.
- `ClerkProvider` in `app/layout.tsx` inside `<body>`. Use `@clerk/nextjs`, not `@clerk/clerk-react`.
- shadcn branch does NOT apply (no `components.json`) — skip `@clerk/ui` install.
- Env: never read/print existing env files. Let `clerk init` write keys; ensure `.env.example` documents `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (client-safe) and `CLERK_SECRET_KEY` (server-only) without real values. Keep project IDs/keys in env per AGENTS.md §12.
- No route protection yet (catalog/lesson pages stay public per AGENTS.md §7). Middleware only provides Clerk auto-proxy + future `clerkMiddleware`; do not gate routes unless init does by default.

## Files expected to touch
- `app/layout.tsx` — add `ClerkProvider` inside `<body>`.
- `components/site-header.tsx` — replace placeholder avatar with auth controls import; keep layout exact.
- `components/auth-controls.tsx` (new, `"use client"`) — `Show`/`SignInButton`/`SignUpButton`/`UserButton` cluster, Tailwind-matched to existing header (e.g. reuse button styles from `components/ui/button.tsx` if suitable).
- `proxy.ts` or `middleware.ts` (created/edited by `clerk init`; then matcher-verified).
- `.env.example` — ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=` + `CLERK_SECRET_KEY=` canonical list (no secrets).
- `.gitignore` — verify env files ignored (no secret commits).
- `package.json` / `package-lock.json` — via `clerk init` SDK install (`@clerk/nextjs`), not hand-edited.
- No changes to `app/page.tsx`, course/lesson pages, Sanity, PostHog.

## Requirements (from user task Steps 1–8)
1. Checklist presented before commands (done in agent message); proceed only on Yes.
2. Step 1: `command -v clerk && clerk --version`; if present `clerk update --yes`, else `npm install -g clerk` (user has no stated pm preference + `package-lock.json` → npm).
3. Step 2: `clerk auth login` from project root immediately after install/update; pause for login flow.
4. Step 3: `clerk init --app app_3JzvEzwhKKhY22j6Y0DUCFlDH6I` (existing project; no `--framework`/`--pm` unless CLI asks).
5. Step 4: verify Next.js matcher includes `'/__clerk/:path*'` after `'/(api|trpc)(.*)'`; add if missing.
6. Step 5: if init reports unsupported/undetected framework, fall back to https://clerk.com/docs/nextjs/getting-started/quickstart (not expected — Next.js is fully scaffolded).
7. Step 6: visible sign-in/sign-up/signed-in controls in existing nav via `@clerk/nextjs` components; reuse/adapt, don't duplicate.
8. Step 7: `clerk doctor`, start app, confirm controls visible, test sign-in + sign-up, fix CLI-reported issues.
9. Step 8: skip (no `components.json`).
10. AGENTS.md boundaries: browser holds no token, never calls MCP/LLM, never writes content/progress; all Clerk secrets server-only; `ClerkProvider` inside `<body>`; Next 15+ `auth()` async (no `auth()` use in this task, but preserve rule).

## Security considerations
- Never expose `CLERK_SECRET_KEY` in client code or commit it. Only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` reaches browser.
- Do not read/print `.env*` contents; ask user for missing non-sensitive config only.
- Middleware/proxy only; no client-side route gating.
- Verify no token leaks in `auth-controls.tsx` (client file imports only Clerk components, no keys).
- Keep `.env.example` value-free.

## Acceptance criteria
- `clerk doctor` passes with no errors.
- `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` passes.
- Dev server starts; header shows Sign in / Sign up when signed out, avatar/`UserButton` when signed in; no layout shift vs reference beyond avatar→controls swap.
- Sign-up as new test user succeeds and profile icon appears.
- `config.matcher` in `proxy.ts`/`middleware.ts` contains `'/__clerk/:path*'` once after `'/(api|trpc)(.*)'`.
- `ClerkProvider` is inside `<body>` in `app/layout.tsx`.
- No `CLERK_SECRET_KEY` in client bundle (grep `NEXT_PUBLIC` only in client files).
- Browsing (/, /courses) remains accessible signed-out.

## Checks to run (from correct workspace = project root `C:\Users\HP\Desktop\vertex`)
- `clerk doctor`
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build` (routes/config/server code change → required per AGENTS.md §13)
- `npm run dev` + manual browser verify (controls render, sign-in/up flow)
- Report real outputs; never claim pass without running.

## Exact manual test steps
1. `npm run dev`, open http://localhost:3000.
2. Confirm header right side shows Sign in + Sign up (signed out), bell still present, mobile nav still shows Courses/My Learning.
3. Click Sign up → complete Clerk flow → confirm redirect back + `UserButton` avatar appears in header.
4. Sign out via `UserButton` menu → confirm Sign in/Sign up reappear.
5. Click Sign in → sign back in → confirm avatar reappears.
6. Visit `/` signed-out → confirm page loads (public browsing preserved).
7. If "Configure your application" callout appears in Clerk Dashboard flow, click it per After-Setup note.
