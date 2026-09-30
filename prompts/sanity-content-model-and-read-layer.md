# Implementation Prompt — Sanity Content Model + Studio Split + Server Read Layer (Vertex)

## Goal
Implement the Sanity content model for Vertex (`course`, `module` embedded, `lesson`, `instructor`, `category`) + split to two standalone workspaces (`studio/` + web at root) + server-only read client and typed data layer. No video/progress/context docs, no search, no pages beyond verification. Build strictly to AGENTS.md §5/§8/§12.

User decision: **Split workspaces now** (not build-in-place).

## Skills read
- `sanity-best-practices` (SKILL.md): workspace setup, schema/GROQ/TypeGen/Portable Text/framework integration; global rules (generated `_id`, `reference` + GROQ lookup, explicit IDs only for singletons).
- `references/schema.md`: `defineType`/`defineField`/`defineArrayMember` always, icons via `@sanity/icons/<Name>` subpath (not root), references vs nested objects, validation patterns, deprecation lifecycle.
- `references/nextjs.md`: standalone Studio recommended (Vite `sanity dev`, auto-updates, TypeGen watch, CORS); embedded Studio (`NextStudio` at `app/studio`) not recommended — migrate by creating `studio/`, moving config+schema, deleting route, keeping `next-sanity` in web; `defineLive`/`sanityFetch`, `useCdn:true` runtime / `false` for static params, stega rules.
- `references/groq.md`: `defineQuery` from `next-sanity`, quoted aliases, `coalesce`, `order` before slice, `_ref` not `->` in filters, merge `->`, always project fields.
- `references/image.md`: image field `hotspot:true` + `alt`, `urlFor` builder, query `asset->{lqip,dimensions}` for blur.
- `references/portable-text.md`: `PortableText` from `next-sanity`/`@portabletext/react`, typed `components`, PTE vs pageBuilder separation.
- `node_modules/next/dist/docs/` (to consult during build): App Router server/client boundaries, `generateStaticParams`, fetch caching.

## Code / config inspected
- `package.json`: `next@16.3.7`, `react@19.2.8`, `next-sanity@13.3.4`, `sanity@5.31.2`, `@sanity/vision`, `@sanity/image-url`, `lucide-react`; missing `@portabletext/react`, `@tailwindcss/typography` (§6 stack). Scripts only `dev/build/start/lint` (use `npx tsc --noEmit` for typecheck).
- `sanity.config.ts:1-28`: embedded config (`basePath:'/studio'`, imports from `./sanity/env`, `./sanity/schemaTypes`, `./sanity/structure`, `structureTool+visionTool`).
- `sanity.cli.ts:1-10`: `defineCliConfig` with `NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET`.
- `sanity/env.ts:1-20`: `apiVersion` defaults `2026-09-29`, asserts `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_PROJECT_ID`.
- `sanity/schemaTypes/index.ts:1-5`: empty `types:[]` — greenfield.
- `sanity/structure.ts:1-7`: default list of all types.
- `sanity/lib/client.ts:1-10`: public `createClient({useCdn:true})`, no token — violates private-dataset rule for reads.
- `sanity/lib/image.ts:1-10`: `createImageUrlBuilder` + `urlFor` — keep pattern.
- `sanity/lib/live.ts:1-9`: `defineLive({client})` without `serverToken/browerToken` — must rework for private dataset.
- `app/studio/[[...tool]]/page.tsx:1-19`: `NextStudio` embedded route (`dynamic='force-static'`) — to delete after standalone `studio/` works.
- `app/layout.tsx:1-36`: `ClerkProvider` inside `<body>`, fonts; add `<SanityLive/>` only if live needed (defer unless trivial).
- `app/page.tsx:1-149`: presentational Server Component, static mock cards — do not wire data yet.
- `proxy.ts:1-11`: `clerkMiddleware`, no Sanity gating.
- `.env.local`: has `NEXT_PUBLIC_SANITY_DATASET=production`, `NEXT_PUBLIC_SANITY_PROJECT_ID=erentn58`, Clerk keys; NO `SANITY_API_READ_TOKEN`, NO `NEXT_PUBLIC_SANITY_API_VERSION`. `.env.example:1-4` only Clerk keys — must extend.
- `.gitignore:33-34`: `.env*` ignored — good.
- `prompts/clerk-auth.md`: prompt-file convention reference.

## Decisions / assumptions
- Standalone split shape: `studio/` = new Sanity workspace (`package.json`, `sanity.config.ts`, `sanity.cli.ts`, `schemaTypes/`, `tsconfig.json`); web = repo root (Next.js, `sanity/lib/*`, queries). This is the minimal split satisfying §5 (independent deploys, auto-updates, TypeGen watch) without full `web/` rename that would break all imports/docs. Root `sanity.config.ts` + `app/studio` route deleted after `studio/` verified. If reviewer wants `web/` rename, defer to follow-up.
- Schema follows AGENTS.md §8 fixed relationships/fields; all else chosen sensibly. `module` = embedded `object` in `course.modules` (not document). `lesson.course` derived via reverse `references()` — no parent field on lesson. UI numbers (Module 5, Lesson 5.1) derived from order, not stored.
- Video/progress/agent-context documents explicitly out of scope (request lists 5 types). No `@sanity/context` plugin install (§12 version lag risk). No `text::semanticSimilarity`.
- Private dataset (§12): new server-only `sanity/lib/server-client.ts` (or `sanityFetch` helper) using `SANITY_API_READ_TOKEN` (no `NEXT_PUBLIC_` prefix), `useCdn:false` or tagged fetch for server reads; browser keeps no token, never calls MCP/LLM. Public `client.ts` kept only for image builder/live if needed, or marked client-safe without token.
- Icons: `@sanity/icons` subpath imports per skill (need `npm i @sanity/icons` in studio if missing).
- Portable Text: lesson `notes` = `array` of `block` + minimal marks only (no custom PTE blocks yet); search needs `pt::text(notes)` projection, not direct match.
- Level: `string` radio list (`beginner/intermediate/advanced/all-levels`); resource `type`: radio (`video/article/repo/docs/other` or similar); learningOutcome `icon`: `string` (lucide key), not image — presentational only.
- TypeGen: enable via `sanity.cli.ts`/`sanity.config.ts` if Studio version supports; otherwise hand-write minimal TS types in `sanity/lib/types.ts` + `queries.ts` with `defineQuery`.
- No seed content import in this task (schema deploy only); provide empty-state-safe queries.

## Files expected to touch
- NEW `studio/package.json`, `studio/sanity.config.ts`, `studio/sanity.cli.ts`, `studio/tsconfig.json`, `studio/.gitignore` (or reuse root), `studio/schemaTypes/{index.ts,course.ts,module.ts,lesson.ts,instructor.ts,category.ts,shared.ts}`.
- DELETE (after verify): `sanity.config.ts`, `sanity.cli.ts`, `sanity/schemaTypes/`, `app/studio/[[...tool]]/page.tsx`; KEEP/REPOINT `sanity/lib/*` in web (root) — update imports from `../env` if moved.
- EDIT `sanity/lib/client.ts` → split public vs server client; NEW `sanity/lib/server.ts` (or `queries.ts`+`fetch.ts`): `sanityFetch` helper with `next:{tags,revalidate}`, `serverClient.withConfig({token, useCdn:false})`.
- NEW `sanity/lib/queries.ts` (+ `types.ts`): `COURSES_LIST`, `COURSE_BY_SLUG` (with modules→lessons expanded, instructor, category), `LESSON_BY_SLUG` (+ parent course via reverse ref), `INSTRUCTOR_BY_SLUG` (+ courses), `CATEGORIES_LIST`; image fragment with `lqip/dimensions/hotspot/crop`.
- EDIT `.env.example`: add `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN` (document server-only, no values).
- EDIT `sanity/env.ts` (web): add `serverToken` export reading non-public env, never imported by client components.
- DOC `prompts/sanity-content-model-and-read-layer.md` (this file).

## Requirements
1. Schema (per §8):
   - `course`: `title`+`slug` (required, unique), `summary` (text), `coverImage` (image+hotspot+alt), `level` (radio), `price` (number), `popular` (boolean, initial false), `studentCount` (number), `learningOutcomes` (array object `{icon,title,description}`), `instructor` (ref→instructor), `category` (ref→category), `modules` (array of `module` object, ordered).
   - `module` (object, not document): `title` (required), `summary`, `lessons` (array ref→lesson, ordered).
   - `lesson`: `title`+`slug`, `videoUrl` (url, youtube/vimeo/bunny only note), `poster` (image+hotspot+alt), `durationSeconds` (number) + optional `durationLabel` display, `freePreview` (boolean), `studentCount`, `notes` (Portable Text array `block`), `keyPoints` (array string/text), `proTip` (text, optional), `resources` (array `{type,title,description,url}`).
   - `instructor`: `name`+`slug`, `photo` (image+hotspot+alt), `expertise` (string/array), `bio` (Portable Text or text).
   - `category`: `title`+`slug`, `description`.
   - Validation: required titles/slugs, `slug` lowercase-hyphen custom check, `price>=0`, `durationSeconds>=0`, `url` scheme http/https, previews (`title+media`) for all.
2. Studio: standalone `studio/` runs via `sanity dev` (:3333), schema visible, Vision enabled, structure lists Courses/Lessons/Instructors/Categories; CORS note for app URL.
3. Read layer (server-only): `serverClient` with `SANITY_API_READ_TOKEN`, `useCdn:false` for SSR/static; `sanityFetch({query,params,tags,revalidate})` helper; queries use `defineQuery`, quoted aliases, projections only (never `*` whole doc), `order` before slice, `_ref` filters, `references(^._id)` for reverse course lookup, `pt::text(notes)` for search-ready text.
4. Boundaries (§5/§12): browser holds no token; no `SANITY_API_READ_TOKEN` in client bundle; all reads server-side; no writes from browser; no MCP/LLM calls.
5. No UI wiring beyond typecheck/verify (pages stay mock); no video/progress/context types.

## Security considerations
- `SANITY_API_READ_TOKEN` server-only (no `NEXT_PUBLIC_`); assert in server module, never import from `"use client"` files; grep verify no client leak.
- Clerk secret stays server-only (untouched); PostHog out of scope.
- Keep project IDs in env, expose only `NEXT_PUBLIC_SANITY_*` to browser; `.env.example` value-free; never commit `.env.local`; never print secrets.
- Private dataset: all GROQ via server client; `useCdn:true` public client must not carry token.

## Acceptance criteria
- `studio/` `sanity schema deploy` (or `sanity deploy` for Studio app per §13) succeeds; Studio at :3333 shows 4 types + embedded modules editable inside course.
- Root `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` passes (routes/config changed → build required).
- `grep -r SANITY_API_READ_TOKEN --include="*.tsx" app/ components/` finds no client usage; server helper imports only in `.ts` server files.
- Queries return empty arrays (no crash) against empty/private dataset with token; `COURSE_BY_SLUG` expands instructor/category/modules→lessons; `LESSON_BY_SLUG` resolves parent course via reverse ref.
- Embedded `app/studio` route removed, root `sanity.config.ts` removed, no stale `NextStudio` import; `next dev` still boots.

## Checks to run (report real output, never claim without running)
- Web (root): `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run dev` boot check.
- Studio (`studio/`): `npm install`, `npx sanity schema deploy` + `npx sanity deploy` (Studio app required for Context MCP later per §12), `npm run dev` boot.
- Verify: `grep` token leak check, Vision query smoke (`*[_type=="course"][0]{_id,title}`), fetch smoke via `node -e` or route test with server token.

## Exact manual test steps
1. `cd studio && npm install && npm run dev` → open http://localhost:3333 → confirm Content shows Courses, Lessons, Instructors, Categories; create test Course with 1 module → 1 lesson ref, set instructor+category, Publish.
2. `npx sanity deploy` (studio app) + `npx sanity schema deploy` → confirm success output.
3. Root: add `SANITY_API_READ_TOKEN` (Sanity Manage → API → Viewer token) to `.env.local` (untracked); `npm run dev` → hit test fetch (e.g. temp server route or `node` script using `sanity/lib/server`) → confirm course list returns test doc, lesson reverse-course resolves.
4. `npx tsc --noEmit && npm run lint && npm run build` → all green.
5. Confirm `/studio` Next route 404s (removed), `/` still renders mock home, no token in browser DevTools Sources.
