# Vertex Home 1440px container — implementation prompt

## Goal

Widen the Vertex Home main content (header, hero, courses, decoration) from `max-w-6xl` (~1152px) to ~1440px, per user request. No visual redesign, no content change.

## Skills read

- `AGENTS.md` (root) — workflow, UI rules (§3: reference image stays source of truth), scope (§1).
- `node_modules/next/dist/docs/` — App Router conventions already confirmed for Home; no routing change in this task.

**No section 4 skill applies.** No Sanity schema, GROQ, Context MCP, or migration work. Pure presentational width change.

## Code inspected

- `app/page.tsx` — 4 `max-w-6xl` containers: hero `div` (line 18), courses `div` (line 48), decoration row `div` (line 127). Inner `max-w-2xl`/`max-w-xl` hero text blocks stay as-is (readability).
- `components/site-header.tsx` — 1 `max-w-6xl` container (line 11). Mobile nav row uses full-width `px-6`, no max-width.
- `app/globals.css` — Vertex tokens v1.0; no container token exists. No token change planned.
- `design/vertex-home.png` — wide desktop composition; widening the container matches the reference proportions.

## Decisions and assumptions

1. **Arbitrary value `max-w-[1440px]`, not a new token.** One-off layout width, not a design-system step. Keeps `globals.css` untouched and avoids implying a new breakpoint scale.
2. **Apply to all 4 containers uniformly.** Header, hero, courses block, decoration row all get `max-w-[1440px]` so edges align vertically. Hero inner text blocks (`max-w-2xl` headline/search, `max-w-xl` subcopy) keep their narrow measure for readability.
3. **Keep `px-6` gutters and responsive stacking.** Only the max-width changes; grid (`md:grid-cols-3`), centering (`mx-auto`), and mobile stacking are untouched.
4. **Out of scope:** `/design-system` page keeps `max-w-6xl`; other future pages (catalog, course, lesson) are separate tasks.

## Files to touch

| File | Action |
|---|---|
| `app/page.tsx` | Replace 3× `max-w-6xl` with `max-w-[1440px]` (hero, courses, decoration) |
| `components/site-header.tsx` | Replace 1× `max-w-6xl` with `max-w-[1440px]` |

No other files.

## Requirements

- Header inner bar: `mx-auto max-w-[1440px] px-6`, height and content unchanged.
- Hero container: `mx-auto max-w-[1440px] px-6`, centered text preserved.
- Courses container: `mx-auto max-w-[1440px] px-6`.
- Decoration row: `mx-auto max-w-[1440px]` flex row preserved.
- No `globals.css`, layout, or component API changes.
- No horizontal overflow at 1440px or 375px viewports.

## Security

No auth, tokens, env, network, or writes. Markup-only class change in Server Components. None of the §12 risks apply.

## Acceptance criteria

1. `/` containers measure ~1440px wide on a ≥1500px viewport.
2. Header, hero, courses, and decoration left/right edges align.
3. Desktop still matches `design/vertex-home.png` proportions; cards stay 3-col.
4. 375px viewport: no horizontal scroll, stacked cards.
5. Type check and lint pass; build passes (route file changed).

## Checks to run

From `C:\Users\HP\Desktop\vertex`:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Paste real output. Never claim a check passed without running it.

## Manual test steps

1. `npm run dev`, open `http://localhost:3000/`.
2. At ≥1500px viewport, measure content box (devtools): ~1440px for header/hero/courses/decoration.
3. Confirm edges align vertically across sections.
4. Resize to 375px: stacked cards, no horizontal overflow.
5. Confirm `/design-system` unchanged.
