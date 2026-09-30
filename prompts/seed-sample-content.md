# Implementation Prompt — Seed Sample Content: 10 Courses + Instructors + Categories (Vertex)

## Goal
Give the catalog and cross-course search real data by importing sample content into the Sanity `production` dataset: a handful of instructors and categories, and at least 10 programming/development/AI courses with modules and lessons. `videos.json` transcripts/chapters stay out of scope (needs the §9 `video`-doc ingestion pipeline, which does not exist yet).

## Skills read
- `sanity-migration` (router workflow + guardrails): deterministic IDs, import referenced docs before referrers, count/reference/sample checks before done, reruns must converge (`createOrReplace` / `--replace` semantics), snapshot before transform.
- `sanity-best-practices` (`references/schema.md`, `references/groq.md`): schema already matches seed types at the document level; verify with count queries. Portable Text stays Portable Text; `pt::text(notes)` for search projections.

## Code / data inspected
- `studio/scripts/seed/seed.ndjson` (141 lines = 141 docs, explicit deterministic `_id`s):
  - `category`: 6 (`web-development`, `ai-engineering`, `backend-infrastructure`, `data`, `languages`, `security`).
  - `instructor`: 5 (Mira Kovac, Daniel Okafor, Priya Raman, Tomas Berg, Alina Costa).
  - `lesson`: 120 (12 per course).
  - `course`: 10, each 4 modules × 3 lessons = 12 lessons: Next.js App Router, React Performance, TypeScript, Building AI Apps with LLMs, RAG from Scratch, Python for Data Work, System Design Foundations, PostgreSQL for Developers, DevOps with Docker/K8s, Practical Web Security.
  - Images use `_sanityAsset: image@https://…` import syntax (picsum cover images, randomuser portraits, ytimg thumbnails) — handled by `sanity dataset import` via download/upload, no asset docs in file.
  - Lesson `videoUrl`: YouTube `watch?v=` URLs (metadata only; no transcript/chapter data here).
- `studio/scripts/seed/videos.json`: 120 keys (lesson slugs) → `{id, title, channel, duration, query}`. No transcript/chapters, not NDJSON — NOT CLI-importable, deferred to §9 pipeline.
- `studio/schemaTypes/`: `course`, `courseModule` (embedded object), `lesson`, `instructor`, `category` — covers all 4 seed `_type`s. No `video` type yet (by design).
- `prompts/sanity-seed-import.md`: earlier prompt for a straight import (`seed.ndjson seul`, no `--replace`, no seed edits). Superseded by the mismatch findings below — straight import will fail validation.
- `studio/.env.local` exists (`SANITY_STUDIO_PROJECT_ID`, `DATASET=production`, non-secret CLI context). Root `.env.local` exists. Neither file's secrets are printed anywhere.
- `studio/env.ts:1-21`: Studio reads project/dataset from env. `git status`: `?? studio/scripts/` — seed files untracked; leave them uncommitted.

## Schema-vs-seed mismatches (verified by script, not guessed)
Straight `sanity dataset import seed.ndjson` will fail or produce invalid docs. Five deterministic mismatches:
1. `course.modules[]`: seed `_type: "module"` vs schema object name `"courseModule"` (`studio/schemaTypes/module.ts:6-10`, referenced in `course.ts:130`). Array member requires `_type: "courseModule"`.
2. `lesson`: seed key `thumbnail` vs schema field `poster` (`lesson.ts:60-73`).
3. `lesson`: seed key `duration` (number, e.g. 350) vs schema field `durationSeconds` required (`lesson.ts:74-79`).
4. `instructor.expertise`: seed is an **array** of strings vs schema `type: "string"` (`instructor.ts:44-49`).
5. `lesson.resources[].type`: seed value `"link"` vs schema radio list `video/article/repo/docs/other` (`lesson.ts:123-138`). Seed `_type: "resource"` matches schema object name — good.
- Everything else matches: `_id`s deterministic, slugs `{_type, current}`, refs (`course.instructor`, `course.category`, `modules[].lessons[]`) point at existing seed IDs, Portable Text `notes`/`bio` are proper blocks with `_key`s, array items carry `_key`s.

## Decisions / assumptions
- The existing `seed.ndjson` already satisfies the user's content ask (10 programming/dev/AI courses, 5 instructors, 6 categories, coherent modules/lessons). No new content is authored; the task is transform + import + verify.
- **Transform, don't edit schema and don't edit the seed.** Schema names (`poster`, `durationSeconds`, `courseModule`, string `expertise`, resource enum) follow AGENTS.md §8 and the already-reviewed content model; changing them now costs a schema redeploy + TypeGen regen. `seed.ndjson` stays byte-identical (per earlier prompt's constraint); a deterministic script writes a generated `seed.import.ndjson` beside it.
- Field mappings:
  - `module` → `courseModule` (`_type` rename only, keep `_key/title/summary/lessons`).
  - `thumbnail` → `poster` (rename key, keep `{_type:image, _sanityAsset, alt}`).
  - `duration` → `durationSeconds` (rename key, keep number).
  - `expertise: [...]` → `"A · B · C"` joined with ` · ` (matches schema `description` example "Next.js & React Performance" headline style).
  - `resources[].type: "link"` → `"docs"` (closest enum value; official-docs URLs). Alternative (add `"link"` to schema enum) rejected to avoid schema churn for seed data.
- Target: project `erentn58`, dataset `production` (the private dataset the web read layer uses). Schema deploy first so imported docs resolve against known types.
- Import with plain `sanity dataset import <generated-file> production` (no `--replace`: preserves anything already there; explicit `_id`s converge on rerun via create-or-replace — abort on conflict errors rather than forcing).
- Auth: requires Sanity CLI auth (`sanity login` browser flow) if not already authenticated. Pause for user if login is needed.
- Asset handling: `_sanityAsset` URLs are downloaded by the import command. If any fail (offline picsum/ytimg/randomuser), record as warnings, do not fabricate assets, and report which docs lack images.
- Reference order: single-file import handles intra-file refs; verify after import zero dangling `_ref`s.

## Files expected to touch
- NEW `studio/scripts/seed/transform-seed.py`: deterministic transform (reads `seed.ndjson`, writes `seed.import.ndjson`; asserts 141 docs in / 141 out, asserts per-type counts unchanged, asserts no `module`/`thumbnail`/`duration`/`link`-type leftovers).
- NEW generated `studio/scripts/seed/seed.import.ndjson` (untracked, beside seed; do not commit — `studio/scripts/` is untracked).
- NEW prompt file: `prompts/seed-sample-content.md` (this file).
- Dataset mutation only in Sanity `production` via CLI. No schema edits, no web code edits, no seed edits.
- `studio/scripts/seed/videos.json`: untouched.

## Requirements
1. Transform script is deterministic and rerunnable: same input bytes → same output bytes; preserves all `_id`s, `_key`s, slugs, refs, Portable Text blocks.
2. `cd studio`: confirm CLI auth; `npx sanity schema deploy` — success output.
3. `npx sanity dataset import scripts/seed/seed.import.ndjson production` — exit 0, docs reported, no errors (asset-download warnings recorded, not fatal unless docs missing).
4. Verify counts: `course==10`, `lesson==120`, `instructor==5`, `category==6`.
5. Verify zero dangling refs: every `course.instructor._ref`, `course.category._ref`, `modules[].lessons[]._ref` resolves to an existing doc.
6. Spot-check search/catalog readiness: one course expands instructor/category/modules→lessons; one lesson's `pt::text(notes)` returns text; lessons-per-course == 12 for all 10 courses.
7. Seed files byte-identical before/after (no modifications to `seed.ndjson` or `videos.json`).

## Security considerations
- Never print tokens; `studio/.env.local` and root `.env.local` stay untracked (gitignored).
- Import targets `production` explicitly — type the dataset name, never a variable.
- No `--replace`, no `--missing` experiments on production without approval.
- `_sanityAsset` URLs are public placeholder CDNs (picsum/randomuser/ytimg) for seed display only — acceptable for sample content, flagged for replacement with real assets later.

## Acceptance criteria
- Transform script passes its own assertions (141 in/out, counts 10/120/5/6, zero leftover mismatched keys).
- Schema deploy succeeds.
- Import exits 0 with 141 docs reported.
- Count queries return 10/120/5/6.
- Zero dangling references from courses to instructors/categories/lessons.
- Catalog-ready spot check: course expansion + lesson text projection + 12-lessons-per-course all pass.
- `git status --short` shows repo source untouched (only new untracked script/generated files + this prompt file).

## Checks to run (from `studio/`, report real output, never claim without running)
- `python3 scripts/seed/transform-seed.py` (or equivalent) — assertion output.
- `npx sanity schema deploy`
- `npx sanity dataset import scripts/seed/seed.import.ndjson production`
- Count + dangling-ref + spot-check GROQ via `npx sanity documents query '<query>'` (or Vision) for each type.
- `git status --short` — confirms no source modifications.

## Exact manual test steps
1. `cd studio && python3 scripts/seed/transform-seed.py` → confirm 141 in/out, counts, zero leftovers.
2. `npx sanity schema deploy` → confirm success.
3. `npx sanity dataset import scripts/seed/seed.import.ndjson production` → confirm 141 imported, 0 errors (note asset warnings if any).
4. Run count queries → 10/120/5/6; dangling-ref query → 0 rows; per-course lesson counts → 12 each.
5. In Studio (`npm run dev` → :3333) confirm Courses (10), Lessons (120), Instructors (5), Categories (6); open one course → instructor, category, module lessons resolve; open one lesson → poster, duration, notes render.
