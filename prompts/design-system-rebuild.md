# Vertex Design System rebuild — implementation prompt

## Goal

Rebuild the Vertex design system from `design/vertex-designsystem.png` as clean, final code: design tokens in Tailwind v4, primitive components for every section of the sheet, and a `/design-system` page that renders all 14 sections in sheet order so the result can be diffed against the reference side by side.

The reference image is the source of truth (AGENTS.md §3). Reproduce it exactly: layout, spacing, typography, color, states. No restyling, no improvement, no invention.

This is a rebuild, not a patch: the existing `components/ui/*` and `app/design-system/page.tsx` (currently untracked working-tree files) are rewritten from scratch. The token values themselves were already verified exact against the served CSS in the previous pass — the rebuild keeps them and fixes the structural defects listed below.

## Skills read

- `AGENTS.md` (root) — full workflow, boundaries, checks. This prompt follows §2 steps 4–5.
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — confirmed the rule for this task: Server Components by default; `"use client"` only for state, event handlers, effects, or browser APIs. All primitives here are pure functions of props, so none get the directive.
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` (read in the previous pass) — global CSS stays the single Tailwind entry point, imported once from the root layout.
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` (read in the previous pass) — `next/font/google` self-hosting, font variables applied on `<html>` in the root layout.

**No §4 Sanity/Context skill applies.** This task is design tokens and presentational primitives with no content model, no data fetching, no MCP, no LLM. The design sheet (§3 authority) is the spec instead. `sanity-best-practices` will be revisited when the content model lands.

## Code inspected

- `app/globals.css` (155 lines) — Tailwind v4 `@theme` tokens already exact (verified against served CSS: 5 primary + 8 neutrals, 8 type sizes + line heights, 4px spacing base, 5 radii + full, 4 shadows with negative spreads). Base layer with antialiasing, body colors, `:focus-visible` ring in `primary-400`. `@layer components` with 8 `.type-*` classes pairing family + weight + size. **Keep as-is; rebuild does not touch it unless a token proves wrong.**
- `app/layout.tsx` (32 lines) — Playfair Display + Inter via `next/font/google` as `--font-playfair` / `--font-inter`, Vertex metadata, `LayoutProps<"/">`. **Keep as-is.**
- `app/design-system/page.tsx` (593 lines) — renders all 14 sections plus a §15 live-samples section. Defects to fix in the rebuild (see Decisions).
- `components/ui/button.tsx` — 4 variants × 2 sizes, correct 44/36px heights via `h-11`/`h-9`, radius `rounded-md` (= 12px token). Sound; keep the API.
- `components/ui/input.tsx` — field spec exact (44px, 12px radius, 1px `neutral-200`, 16px padding, focus `primary-400`, ⌘K hint). Sound; keep the API.
- `components/ui/badge.tsx`, `status.tsx`, `progress.tsx`, `breadcrumb.tsx`, `logo.tsx`, `card.tsx` — all read in full. APIs sound; defects are in the showcase page's usage, not the primitives (see Decisions).
- `package.json` — Next 16.3.7, React 19.2.8, Tailwind v4, `lucide-react ^1.48.0` already installed. **No new dependency.**
- `git status` — `components/`, `app/design-system/`, `design/`, `prompts/` are all untracked (`??`); `AGENTS.md`, `globals.css`, `layout.tsx`, `package.json` modified. The rebuild adds no new tracked-file risk beyond what already exists.

## Decisions and assumptions

1. **Tokens and layout are frozen.** They were diffed value-by-value against the sheet and passed. The rebuild rewrites components + showcase page only. If a token mismatch surfaces during rebuild, I stop and flag it rather than silently changing a value.
2. **Fix the `font-sans` stacking defect.** Current page line 219 renders the Inter "Ag" as `type-display-1 font-sans font-semibold` — three conflicting font/weight sources where cascade order decides the winner. The rebuild gives the Inter specimen its own explicit class (Inter family, semibold, 48px) instead of stacking overrides on the Playfair class.
3. **Fix the §07 buttons grid.** The current grid declares 4 columns but renders an `sr-only` state label plus 4 buttons per row; it only aligns because `sr-only` is absolute. The rebuild uses an explicit row-label column (visible "Default / Hover / Disabled" labels, as the sheet shows state rows) so the grid is honest.
4. **Hover rows stay simulated, explicitly.** A static showcase cannot trigger `:hover` on demand; the sheet shows all three states side by side. The rebuild keeps the `bg-primary-400` override technique for the Hover row but isolates it in a clearly-named `HoverPreview` wrapper so nobody mistakes it for the real hover rule (which lives on the component and works live).
5. **Keep the §15 Live Samples section.** It proves the primitives work as wired components (links, real hover, focus). It is clearly separated from the 14 sheet sections, not presented as part of the sheet.
6. **No `use client` anywhere.** Verified against the Server/Client doc: no state, no handlers, no effects, no browser APIs. `Select` uses `defaultValue` (uncontrolled, server-safe).
7. **Literal class strings only.** No `rounded-${token}` templates or computed class names — Tailwind v4 scans source for literals, and the previous pass proved a dynamic template silently drops `rounded-xl`.
8. **Showcase swatches keep referencing real token classes** (`bg-primary-300`, `size-10`, …) rather than inline hex/px, so the page continues to prove the tokens resolve instead of restating values.
9. **Responsive.** No mobile reference exists; components stay mobile-safe by default (fluid widths, wrapping rows) while desktop matches the sheet exactly.

## Files to touch

| File | Action |
|---|---|
| `app/design-system/page.tsx` | Rewrite: all 14 sections in sheet order + §15 live samples, with defects 2–4 fixed |
| `components/ui/button.tsx` | Rewrite (same API): primary, secondary, tertiary, text × lg/md × default/hover/disabled |
| `components/ui/input.tsx` | Rewrite (same API): search with ⌘K, text, select |
| `components/ui/badge.tsx` | Rewrite (same API): video, lesson, popular |
| `components/ui/status.tsx` | Rewrite (same API): in-progress, completed, now-playing, locked |
| `components/ui/progress.tsx` | Rewrite (same API): track + fill + percentage |
| `components/ui/card.tsx` | Rewrite (same API): course, lesson-video, lesson, resource |
| `components/ui/breadcrumb.tsx` | Rewrite (same API): breadcrumbs + pagination |
| `components/ui/logo.tsx` | Rewrite (same API): orange mark + wordmark |
| `app/globals.css` | Untouched unless a token proves wrong (then flag, don't silently change) |
| `app/layout.tsx` | Untouched |
| `package.json` | Untouched (lucide-react already present) |

## Requirements

**§01 Colors** — primary 100 `#FFEFE5`, 200 `#FED7AA`, 300 `#FDBA74`, 400 `#FB923C`, 500 `#F97316`; neutrals 50 `#FAFAFC`, 100 `#F1F5F9`, 200 `#E2E8F0`, 300 `#CBD5E1`, 500 `#64748B`, 700 `#334155`, 900 `#0F172A`, plus white. Already in tokens; showcase must exercise every step as a real class.

**§02/03 Type** — Playfair Display: Display 1 `48/56` bold, Display 2 `36/44` bold. Inter: Heading 1 `28/36` semibold, Heading 2 `22/30` semibold, Heading 3 `18/26` medium, Body Large `16/24`, Body `14/20`, Small `12/16` regular. Pairings encoded in `.type-*` classes; the Inter "Ag" specimen gets its own class (Decision 2).

**§04 Spacing** — 4px base via `--spacing`; steps 4, 8, 12, 16, 24, 32, 40, 48, 64 rendered with real spacing utilities.

**§05 Radius & shadows** — 4, 8, 12, 16, 24, full; `sm 0 1px 2px 0 rgba(15,23,42,.05)`, `md 0 4px 12px -2px (.08)`, `lg 0 12px 24px -4px (.10)`, `xl 0 20px 40px -8px (.12)`. Negative spreads kept.

**§06 Icons** — lucide, 24×24 (`size-6`), 2px stroke outline, rounded caps; filled row via `fill="currentColor"` + `strokeWidth={0}`; spec list (grid, stroke, caps, optical balance).

**§07 Buttons** — 44px lg / 36px md, radius 12px, padding `0 16px` lg / `0 12px` md, Inter Medium 14–16px. Four variants, three visible state rows with honest labels, spec list.

**§08 Inputs** — 44px, radius 12px, `1px solid #E2E8F0`, padding `0 16px`, focus `#FB923C`, placeholder `#FB923C`, ⌘K hint, chevron select, spec list.

**§09 Badges** — video / lesson / popular, uppercase, letterspaced, small.

**§10 Status** — in-progress (spinning arc), completed (green check), now-playing (orange play), locked (grey lock).

**§11 Progress** — 4px track `neutral-100`, fill `primary-500`, rounded ends, `35% complete` label, real `role="progressbar"` + `aria-valuenow`.

**§12 Cards** — course (icon block, serif title, summary, meta row with divider), lesson-video (VIDEO badge, title, description, `Lesson 5.1 · 12:45`, "Watch from 12:45" action), lesson (LESSON badge, key points, "View lesson" action), resource (type icon, title, description, `PDF · 1.2 MB`, external-link icon).

**§13 Navigation** — logo lockup, breadcrumbs with chevron separators, pagination with outlined active page.

**§14 Principles** — four items, icon + title + line. Content, not a component.

## Security considerations

No auth, no tokens, no data access, no network calls, no LLM — none of the §12 risks apply. Concretely: no `NEXT_PUBLIC_*` additions, no env changes, no server routes, no client directives; every component stays a pure presentational function of props renderable from a Server Component.

## Acceptance criteria

1. `/design-system` renders all 14 sheet sections (+ separated §15) with no console errors and no hydration warnings.
2. Every hex, size, line height, radius, and shadow matches the sheet (tokens already verified; rebuild must not regress them).
3. Tokens live in `globals.css`; no component hardcodes a color, shadow, or radius the sheet defines.
4. Each primitive is importable from `components/ui/*`, not inline markup on the page.
5. No `"use client"` directive in `components/ui` or the showcase page.
6. No dynamic/computed Tailwind class strings anywhere; every utility class is a source literal.
7. Type check, lint (on `app` + `components`), and production build all pass.

## Checks to run

From `C:\Users\HP\Desktop\vertex`:

```bash
npx tsc --noEmit
npx eslint app components
npm run build
```

Real output pasted in the report. No claim without running. (`npm run lint` covers the whole repo including vendored skill references with a known pre-existing warning; the scoped `npx eslint app components` is the gate for this task.)

## Manual test steps

1. `npm run dev`, open `http://localhost:3000/design-system`.
2. Compare against `design/vertex-designsystem.png` section by section, 01 through 14.
3. Open at 375px wide; confirm nothing overflows horizontally.
4. Tab through: visible focus rings on inputs/buttons, disabled buttons not focusable.
5. Hover each live button/link in §15; confirm the real `:hover` rule fires.
6. Confirm the Inter "Ag" specimen renders in Inter semibold (not Playfair) and the Playfair "Ag" renders in Playfair bold.
7. Confirm the §07 state rows are labeled Default / Hover / Disabled.
