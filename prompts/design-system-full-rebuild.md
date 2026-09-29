# Vertex Design System full rebuild — implementation prompt

## Goal

Rebuild the Vertex design system **entirely from scratch** from `design/vertex-designsystem.png`: delete the existing implementation files, then recreate them fresh — tokens, root layout, all 8 primitives, and the `/design-system` showcase page rendering all 14 sections in sheet order.

The reference image is the source of truth (AGENTS.md §3). Reproduce it exactly: layout, spacing, typography, color, states. No restyling, no improvement, no invention.

## Skills read

- `AGENTS.md` (root) — full workflow, boundaries, checks. This prompt follows §2 steps 4–5.
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — Server Components by default; `"use client"` only for state, event handlers, effects, or browser APIs. None of the primitives need it.
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` (previous pass) — global CSS is the single Tailwind entry point, imported once from the root layout.
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` (previous pass) — `next/font/google` self-hosting, font variables on `<html>` in the root layout.

**No §4 Sanity/Context skill applies.** Design tokens and presentational primitives only — no content model, no data fetching, no MCP, no LLM. The sheet is the spec. `sanity-best-practices` returns when the content model lands.

## Code inspected

Current implementation (written in the two previous passes, fully read back):

- `app/globals.css` (155 lines) — Tailwind v4 `@theme` tokens (5 primary + 8 neutrals, 8 type sizes + line heights, 4px spacing, 5 radii + full, 4 shadows), base layer, 8 `.type-*` classes. Values verified exact against served CSS.
- `app/layout.tsx` (32 lines) — Playfair Display + Inter, Vertex metadata, `LayoutProps<"/">`.
- `app/design-system/page.tsx` (~700 lines) — all 14 sections + §15 live samples.
- `components/ui/` — `button.tsx`, `input.tsx`, `badge.tsx`, `status.tsx`, `progress.tsx`, `breadcrumb.tsx`, `logo.tsx`, `card.tsx`. All presentational, no client directives.
- `package.json` — Next 16.3.7, React 19.2.8, Tailwind v4, `lucide-react ^1.48.0` installed. `postcss.config.mjs` already wired.
- `git status` — `components/`, `app/design-system/`, `design/`, `prompts/` untracked; nothing in the rebuild scope is committed.

## Decisions and assumptions

1. **"From scratch" means delete-then-recreate, not edit.** Every file in scope is removed first, then written fresh. Nothing is carried over by editing; identical values are re-typed from the sheet.
2. **Scope boundary: implementation files only.** `node_modules`, `package.json`, `package-lock.json`, `postcss.config.mjs`, and `tsconfig.json` are untouched — `lucide-react` stays installed, no reinstall. Say otherwise and I wipe/reinstall too.
3. **Tokens re-derived from the sheet, not copied from the old file.** Primary 100–500, neutrals 50–900 + white, 8 type sizes + line heights, 4px spacing base, radii 4/8/12/16/24/full, 4 shadows with negative spreads — each value re-read from `design/vertex-designsystem.png`.
4. **Known defects from the last two passes are designed out from the start** (not fixed after the fact): Inter "Ag" specimen gets its own explicit Inter class (never `type-display-1` + `font-sans` stacked); §07 buttons use an honest 5-column grid with visible Default/Hover/Disabled labels; hover simulation isolated in a named `HoverPreview` wrapper; literal class strings only (no `rounded-${token}` templates); swatches reference real token classes.
5. **No `use client` anywhere.** Pure functions of props, uncontrolled `Select` via `defaultValue`.
6. **Showcase keeps §15 Live Samples**, clearly separated from the 14 sheet sections.
7. **Responsive.** No mobile reference; mobile-safe by default, desktop exact.

## Files to touch

| File | Action |
|---|---|
| `app/globals.css` | Delete, recreate: full `@theme` token set, base layer, `.type-*` classes |
| `app/layout.tsx` | Delete, recreate: Playfair + Inter, Vertex metadata, `LayoutProps<"/">` |
| `app/design-system/page.tsx` | Delete, recreate: 14 sections + §15 |
| `components/ui/button.tsx` | Delete, recreate (same API as before) |
| `components/ui/input.tsx` | Delete, recreate (same API) |
| `components/ui/badge.tsx` | Delete, recreate (same API) |
| `components/ui/status.tsx` | Delete, recreate (same API) |
| `components/ui/progress.tsx` | Delete, recreate (same API) |
| `components/ui/card.tsx` | Delete, recreate (same API) |
| `components/ui/breadcrumb.tsx` | Delete, recreate (same API) |
| `components/ui/logo.tsx` | Delete, recreate (same API) |
| `prompts/design-system.md`, `prompts/design-system-rebuild.md` | Kept as history, untouched |

## Requirements

Same sheet spec as `prompts/design-system-rebuild.md` (§01–§14: colors, type scale, spacing, radius/shadows, icons, buttons, inputs, badges, status, progress, cards, navigation, principles). Nothing about the spec changed — only the method (fresh rewrite). The rebuild must satisfy the same acceptance criteria:

1. `/design-system` renders all 14 sheet sections (+ separated §15), no console errors, no hydration warnings.
2. Every hex, size, line height, radius, shadow matches the sheet.
3. Tokens live in `globals.css`; no hardcoded color/shadow/radius in components.
4. Each primitive importable from `components/ui/*`.
5. No `"use client"` in scope.
6. Literal Tailwind class strings only.
7. Type check, scoped lint, and production build pass.

## Security considerations

No auth, no tokens, no data access, no network calls, no LLM — none of the §12 risks apply. No env changes, no server routes, no client directives.

## Checks to run

From `C:\Users\HP\Desktop\vertex`:

```bash
npx tsc --noEmit
npx eslint app components
npm run build
```

Real output pasted in the report. No claim without running.

## Manual test steps

1. `npm run dev`, open `http://localhost:3000/design-system`.
2. Compare against `design/vertex-designsystem.png`, sections 01–14.
3. Open at 375px wide; confirm no horizontal overflow.
4. Tab through: visible focus rings, disabled buttons not focusable.
5. Hover §15 live buttons; confirm real `:hover` fires.
6. Confirm Inter "Ag" is Inter semibold, Playfair "Ag" is Playfair bold.
7. Confirm §07 rows labeled Default / Hover / Disabled.
