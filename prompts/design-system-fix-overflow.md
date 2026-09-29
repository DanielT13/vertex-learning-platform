# Design system overflow fix — implementation prompt

## Goal

Fix the two defects visible in `c:\Users\HP\Music\Capture d'écran 2026-09-29 170914.png`:

1. **§07 Buttons matrix overflows its card.** The 5-column grid (state label + 4 buttons) is wider than the one-third column it sits in, so the Tertiary/Text columns are clipped at the card edge ("Viev…").
2. **Search input icon overlaps the text.** The magnifier sits at `left-4` but the input only has 16px of left padding, so "Search anything…" starts underneath the icon.

Reference image (`design/vertex-designsystem.png`) remains the source of truth. No restyling.

## Skills read

- `AGENTS.md` — workflow, §3 responsive rule (adapt sensibly, desktop exact).
- Server/Client + CSS + fonts docs (previous passes). No new skill needed; no §4 skill applies to a presentational fix.

## Code inspected

- `app/design-system/page.tsx` — §07 uses `grid-cols-[64px_1fr_1fr_1fr_1fr]` inside a `lg:grid-cols-3` trio card (~350px available; content needs ~520px). §06/§07/§08 trio confirmed as the overflow context.
- `components/ui/input.tsx` — `SearchInput` input has `${field} pr-20` (right clearance for ⌘K) but no left clearance for the `left-4 size-5` icon. `Select` already has `pr-11` for its chevron and is fine.

## Decisions and assumptions

1. **§07 matrix becomes horizontally scrollable inside its card** (`overflow-x-auto` on the matrix wrapper, buttons keep `whitespace-nowrap` + a `min-w-max` inner so nothing wraps or clips). The trio side-by-side layout from the sheet is preserved; on narrow widths the row scrolls instead of clipping. No layout invention, just containment.
2. **Search input gets `pl-11`** (44px: 16px offset + 20px icon + 8px gap), mirroring the existing `pr-20`/`pr-11` right-side pattern. Icon, text, and ⌘K hint then all clear each other.
3. Nothing else changes. No token, layout, or API changes.

## Files to touch

| File | Action |
|---|---|
| `app/design-system/page.tsx` | Wrap the three §07 button rows (headers + Default/Hover/Disabled) in an `overflow-x-auto` container with a `min-w-max` inner |
| `components/ui/input.tsx` | Add `pl-11` to the `SearchInput` input element only |

## Requirements

- All four button columns fully visible via horizontal scroll; zero clipping at desktop width.
- Search text/placeholder starts clear of the magnifier; ⌘K hint still clear on the right.
- Everything else pixel-identical to current.

## Security considerations

Presentational only. No env, no routes, no client directives.

## Acceptance criteria

1. §07 shows all 4 buttons per row with no clipped text; overflow scrolls, never clips.
2. Search input text clears the icon by ~8px.
3. `tsc`, scoped `eslint`, `build` pass.

## Checks to run

```bash
npx tsc --noEmit
npx eslint app components
npm run build
```

## Manual test steps

1. `npm run dev`, open `http://localhost:3000/design-system`.
2. §07: confirm "View Lesson" / "Watch Video" fully visible (scroll if needed), nothing cut at the card edge.
3. §08: confirm the magnifier no longer touches "Search anything…".
4. Re-compare 01–14 vs the sheet; confirm nothing else moved.
