# Vertex Design System — implementation prompt

## Goal

Implement the Vertex design system from `design/vertex-designsystem.png` as real code: the design tokens in Tailwind v4, the primitive components the sheet specifies, and a `/design-system` page that renders the sheet so the result can be compared against the reference side by side.

The reference image is the source of truth (AGENTS.md §3). Reproduce it exactly. No restyling, no improvement, no invention.

## Skills read

- `AGENTS.md` (root) — workflow, boundaries, checks.
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` — confirmed global CSS stays the Tailwind entry point, one stylesheet imported from the root layout.
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` — confirmed `next/font/google` self-hosting, font variables applied on the root layout.

**No section 4 skill applies to this task.** The listed skills are Sanity schema/GROQ, the Context MCP, and migration work. This task is design tokens and presentational primitives with no content model, no data fetching, and no LLM. I read the design sheet instead, which §3 designates as the authority. I will revisit `sanity-best-practices` when the content model lands.

## Code inspected

- `app/globals.css` — 26 lines, Tailwind v4 via `@import "tailwindcss"`, an `@theme inline` block mapping `--color-background`/`--color-foreground` to Geist variables, a `prefers-color-scheme: dark` block, and a `body` rule forcing Arial. All of it gets replaced.
- `app/layout.tsx` — loads Geist + Geist_Mono, exposes them as `--font-geist-sans`/`--font-geist-mono`, metadata is the create-next-app placeholder, uses the generated `LayoutProps<"/">` type.
- `app/page.tsx` — the create-next-app template. Untouched by this task; the design system page is separate.
- `package.json` — Next 16.3.7, React 19.2.8, Tailwind 4.3.3, TypeScript 5.9.3. No icon library.
- `postcss.config.mjs` — already wired to `@tailwindcss/postcss`. No change.
- Confirmed Next 16 conventions from the vendored docs before writing: the root layout is the only stylesheet entry, and `next/font` variables belong on `<html>`.

## Decisions and assumptions

1. **Drop dark mode.** The sheet is light-only and defines no dark palette. The existing `prefers-color-scheme` block would produce an unsupported second theme, so it goes. I flag this because it is a behavior change, not just a restyle.

2. **Playfair Display + Inter replace Geist.** The type scale assigns Display 1/2 to Playfair Display and everything else to Inter. `--font-geist-sans`/`--font-geist-mono` are removed. Playfair stays display-only; body copy is Inter.

3. **Add `lucide-react`.** §06 specifies a 24×24 grid, 2px stroke, rounded line caps — that is lucide's default geometry, so hand-rolling SVGs would be worse. Filled variants exist for the filled row. This is a new dependency; say no and I will inline SVGs instead.

4. **Type scale is encoded in components, not left to utility soup.** A token for the size and a separate class for the weight invites mismatch. Each text style pairs them, so a component cannot render a 48px heading in Regular by accident.

5. **Token names are semantic, values are literal.** `--color-primary-500: #F97316` rather than aliasing to an existing Tailwind orange. The sheet is the palette of record; if it drifts from Tailwind's defaults, the sheet wins.

6. **The showcase page stays in the repo.** It is the only way to diff implementation against the reference later. It ships as a real route, not a dev-only branch.

7. **Responsive.** No mobile reference exists, so components are built mobile-safe by default (fluid widths, wrapping meta rows) while desktop matches the sheet exactly.

## Files to touch

| File | Action |
|---|---|
| `app/globals.css` | Rewrite: full token set in `@theme`, base layer, drop Geist + dark mode |
| `app/layout.tsx` | Playfair Display + Inter via `next/font/google`, Vertex metadata, keep `LayoutProps<"/">` |
| `app/design-system/page.tsx` | New: renders all 14 sections of the sheet |
| `components/ui/button.tsx` | New: primary, secondary, tertiary, text × lg/md × default/hover/disabled |
| `components/ui/input.tsx` | New: search/text input and select, with the ⌘K affordance |
| `components/ui/badge.tsx` | New: video, lesson, popular |
| `components/ui/status.tsx` | New: in progress, completed, now playing, locked |
| `components/ui/progress.tsx` | New: track + fill + percentage |
| `components/ui/card.tsx` | New: course, lesson-video, lesson, resource |
| `components/ui/breadcrumbs.tsx` | New |
| `components/ui/pagination.tsx` | New |
| `components/ui/logo.tsx` | New: the orange mark + wordmark |
| `package.json` | Add `lucide-react` |

## Requirements

**§01 Colors** — 5 primary steps (`100 #FFEFE5`, `200 #FED7AA`, `300 #FDBA74`, `400 #FB923C`, `500 #F97316`) and 8 neutral steps (`50 #FAFAFC`, `100 #F1F5F9`, `200 #E2E8F0`, `300 #CBD5E1`, `500 #64748B`, `700 #334155`, `900 #0F172A`, plus white). Exact hex from the sheet.

**§02/03 Type** — Playfair Display: Display 1 `48/56` bold, Display 2 `36/44` bold. Inter: Heading 1 `28/36` semibold, Heading 2 `22/30` semibold, Heading 3 `18/26` medium, Body Large `16/24` regular, Body `14/20` regular, Small `12/16` regular. Sizes and line heights as tokens, pairings in components.

**§04 Spacing** — 4px base, steps 4, 8, 12, 16, 24, 32, 40, 48, 64.

**§05 Radius & shadows** — radius 4, 8, 12, 16, 24, full. Shadows `sm 0 1px 2px 0 rgba(15,23,42,.05)`, `md 0 4px 12px -2px …(.08)`, `lg 0 12px 24px -4px …(.10)`, `xl 0 20px 40px -8px …(.12)`. The negative spread is in the sheet; keep it.

**§06 Icons** — 24×24, 2px stroke outline, rounded caps; filled variants for active state.

**§07 Buttons** — height 44px lg / 36px md, radius 12px, padding `0 16px` lg / `0 12px` md, Inter Medium 14–16px. Primary solid `primary-500`, secondary orange outline, tertiary subtle fill, text link with optional trailing icon. Disabled keeps layout and drops opacity.

**§08 Inputs** — height 44px, radius 12px, border `1px solid #E2E8F0`, padding `0 16px`, focus border `#FB923C`, placeholder `#FB923C`. The search field carries the ⌘K hint at the right edge. Select shows a chevron.

**§09 Badges** — video (orange), lesson (indigo), popular (orange). Uppercase, letterspaced, small.

**§10 Status** — in progress (spinning orange arc), completed (green check), now playing (filled orange play), locked (grey lock).

**§11 Progress** — 4px track in `neutral-100`, fill in `primary-500`, rounded ends, percentage label.

**§12 Cards** — course (icon block, Playfair title, summary, meta row), lesson-video (video tag, title, description, `Lesson 5.1 · 12:45`, "Watch from 12:45" action), lesson (lesson tag, key points, "View lesson" action), resource (type icon, title, description, external link).

**§13 Navigation** — logo lockup, breadcrumbs with chevron separators, pagination with an outlined active page.

**§14 Principles** — four-column, icon plus title plus line. Content, not a component.

**Showcase page** — all 14 sections in sheet order so it can be diffed against the PNG. Not a redesign: the showcase may be plainer than the sheet's own presentation chrome, but every token and component it demonstrates must match the sheet's values.

## Security

No auth, no tokens, no data access, no network calls, no LLM. This task introduces none of the risks in §12. Concretely: no `NEXT_PUBLIC_*` additions, no env changes, and every component stays a pure presentational function of its props, so it is safe to render from a Server Component. The components take no callbacks that would require `"use client"`; I add that directive only if a piece genuinely needs state, and I call it out if I do.

## Acceptance criteria

1. `/design-system` renders all 14 sections with no console errors and no hydration warnings.
2. Every hex, size, line height, radius, and shadow matches the sheet.
3. Tokens live in `globals.css`; no component hardcodes a color or shadow that the sheet defines.
4. Each component exists as an importable primitive, not as inline markup on the showcase page.
5. Components render inside a Server Component without a client directive unless stated.
6. Type check and lint pass.
7. Production build passes.

## Checks to run

From `C:\Users\HP\Desktop\vertex`:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

I will paste the real output. I will not claim a check passed without running it.

## Manual test steps

1. `npm run dev`, open `http://localhost:3000/design-system`.
2. Compare against `design/vertex-designsystem.png` section by section, 01 through 14.
3. Open `http://localhost:3000/design-system` at 375px wide and confirm nothing overflows.
4. Tab through the showcase: focus rings visible on inputs, buttons keyboard-activatable, disabled buttons not focusable.
5. Check the four button states render distinctly (default, hover, disabled).
6. Confirm the type scale's line heights visually: Display 1 at 48/56, Small at 12/16.
