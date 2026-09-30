# Implementation Prompt — Seed Sanity Dataset from seed.ndjson (Vertex)

## Goal
Import `studio/scripts/seed/seed.ndjson` (141 docs) into the Sanity `production` dataset via the Sanity CLI, then verify document counts. Do not modify the seed files. `videos.json` is explicitly out of scope (needs the §9 ingestion pipeline: `video` type + captions + chapters).

User decision: **seed.ndjson seul**.

## Skills read
- `sanity-migration` (router workflow + guardrails): deterministic IDs, import referenced docs before referrers, count/reference/sample checks before done, reruns must converge (`createOrReplace` / `--replace` semantics), snapshot before transform.
- `sanity-best-practices` (`references/schema.md`, `references/groq.md`): schema already matches seed types; verify with count queries.

## Code / data inspected
- `studio/scripts/seed/seed.ndjson` (392 KB, 141 lines = 141 docs, all with explicit `_id`):
  - `category`: 6, `instructor`: 5, `lesson`: 120, `course`: 10.
  - First doc keys: `_id, _type, title, slug, description`.
  - Lesson sample `videoUrl`: YouTube `watch?v=` URLs (metadata only; transcripts live in the future `video` docs).
- `studio/scripts/seed/videos.json` (33 KB): JSON object with 120 keys (lesson slugs) → `{id, title, channel, duration, query}`. No transcript/chapter data, not NDJSON-shaped → not CLI-importable as-is. Deferred.
- `studio/` schema: `course, courseModule (embedded), lesson, instructor, category` — covers all 4 seed `_type`s. No `video` type yet (by design).
- `studio/.env.local`: `SANITY_STUDIO_PROJECT_ID=erentn58`, `DATASET=production` (non-secret, CLI context).
- `git status`: `?? studio/scripts/` — seed files untracked; leave them uncommitted (or commit separately, not in this task).

## Decisions / assumptions
- Target: project `erentn58`, dataset `production` (the private dataset the web read layer uses).
- Schema deploy first (`sanity schema deploy` from `studio/`), so imported docs resolve against known types in Studio.
- Import with plain `sanity dataset import scripts/seed/seed.ndjson production` (no `--replace`: preserves anything already there; explicit `_id`s make reruns converge via create-or-replace semantics — verify CLI behavior, abort on conflict errors rather than forcing).
- Auth: requires `sanity login` (interactive browser flow) if CLI is not already authenticated. Pause for user if login is needed.
- No asset upload expected (seed uses image refs or external URLs — verify during import; if seed references `image-…` asset IDs without asset docs, note them as warnings, do not fabricate assets).
- Reference order: single-file import handles intra-file refs; verify after import that `course.instructor`, `course.modules[].lessons[]`, `course.category` resolve (no dangling `_ref`s).

## Files expected to touch
- None (read-only task on the repo). Seed files are not modified.
- New prompt file: `prompts/sanity-seed-import.md` (this file).
- Dataset mutation only in Sanity `production` (via CLI), not in git.

## Requirements
1. `cd studio`, confirm CLI auth (`sanity debug --secrets` or `dataset list`); `sanity login` if needed (user completes browser flow).
2. `npx sanity schema deploy` — success output.
3. `npx sanity dataset import scripts/seed/seed.ndjson production` — success, no errors.
4. Verify counts via Vision/API: `count(*[_type=="course"])==10`, `lesson==120`, `instructor==5`, `category==6`.
5. Verify no dangling refs: courses whose `instructor._ref` / `modules[].lessons[]._ref` point to missing docs → must be zero. Report any.
6. Do not touch `videos.json`; do not create a `video` type; do not edit seed files.

## Security considerations
- Never print tokens; `studio/.env.local` stays untracked (gitignored).
- Import targets `production` explicitly — type the dataset name, never a variable, to avoid accidents.
- No `--replace`, no `--missing` flag experiments on production without approval.

## Acceptance criteria
- Schema deploy succeeds.
- Import exits 0 with 141 docs reported.
- Count queries return 10/120/5/6.
- Zero dangling references from courses to instructors/lessons.
- Seed files byte-identical before/after (no modifications).

## Checks to run (from `studio/`, report real output)
- `npx sanity schema deploy`
- `npx sanity dataset import scripts/seed/seed.ndjson production`
- Count + dangling-ref GROQ via `npx sanity documents query '<query>'` (or Vision) for each type.
- `git status --short` — confirms repo untouched (besides this prompt file).

## Exact manual test steps
1. `cd studio && npx sanity schema deploy` → confirm success.
2. `npx sanity dataset import scripts/seed/seed.ndjson production` → confirm 141 imported, 0 errors.
3. In Studio (`npm run dev` → :3333) confirm Courses (10), Lessons (120), Instructors (5), Categories (6) list correctly; open one course → instructor, category, and module lessons resolve.
4. Run count queries → 10/120/5/6; dangling-ref query → 0 rows.
