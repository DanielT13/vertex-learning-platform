# Vertex Home — implementation prompt

## Goal

Implement the Vertex Home page from `design/vertex-home.png` as the root route `/`, replacing the create-next-app placeholder in `app/page.tsx`.

The reference image is the source of truth (AGENTS.md §3). Reproduce it exactly: header, hero, search field, All Courses grid, weekly-note divider, bottom gradient decoration. No restyling, no improvement, no invention.

Presentational only. Static mock data for the 3 visible course cards. No Sanity fetch, no Clerk, no PostHog, no search API in this task.

## Skills read

- `AGENTS.md` (root) — workflow, UI rules (§3), structure (§5), scope (§1: build nothing beyond the named surfaces).
- `node_modules/next/dist/docs/` — confirmed App Router conventions before writing: `app/page.tsx` default-exported Server Component, root `app/layout.tsx` owns the stylesheet import, no `"use client"` for presentational markup.

**No section 4 skill applies to this task.** The listed skills cover Sanity schema/GROQ, Context MCP wiring, and migration. This task is a static landing page with no content model, no data fetching, and no LLM. I read the design sheet reference and the existing primitives instead, per §3. `sanity-best-practices` will be revisited when courses come from Sanity.

## Code inspected

- `design/vertex-home.png` — header (Vertex lockup left, Courses / My Learning nav, bell + avatar right), hero (INTELLIGENT LEARNING eyebrow, Playfair headline "Search your learning in plain English.", gray subtitle, orange "Explore Courses →" CTA, large search field with ⌘K), "All Courses" row (serif title left, orange "View all courses →" right), 3-column course cards, centered "New courses and lessons added every week." divider with star, bottom peach gradient bar decoration.
- `app/page.tsx` — 69 lines, create-next-app template. Fully replaced by this task.
- `app/layout.tsx` — Inter + Playfair Display via `next/font/google`, `LayoutProps<"/">`, Vertex metadata. No change needed.
- `app/globals.css` — Vertex Design System v1.0 tokens (`primary-100…500`, neutrals, `type-display-*`, radius, shadows). No token change; home reuses them.
- `app/design-system/page.tsx` — proves intended usage: `Logo`, `ButtonLink`, `SearchInput`, `CourseCard` with `meta={[{icon:"level"…},{icon:"duration"…},{icon:"lessons"…}]}`.
- `components/ui/logo.tsx` — orange mark + wordmark lockup, reuse as-is.
- `components/ui/button.tsx` — `ButtonLink variant="primary" size="lg"`, reuse for CTA.
- `components/ui/input.tsx` — `SearchInput` (44px, rounded-md, ⌘K kbd), reuse for hero search.
- `components/ui/card.tsx` — `CourseCard` + `MetaRow` (`level→Gauge`, `duration→Clock`, `lessons→Folder`), reuse for the 3 cards.
- `package.json` — Next 16.3.7, React 19, Tailwind v4, `lucide-react` present. No new dependency.
- `components/ui/` — `badge`, `breadcrumb`, `progress`, `status` exist but are not needed on home; not imported.

## Decisions and assumptions

1. **Server Component, no client JS.** Page is static markup (`SearchInput` and `ButtonLink` are presentational). Search submit/navigation and auth state arrive in later tasks; the input renders with a `placeholder` and `aria-label`, wrapped in a non-submitting container or link to `/courses` if a form element is needed — no `onSubmit`, no `"use client"`.
2. **Reuse primitives, add only a site header.** `Logo`, `ButtonLink`, `SearchInput`, `CourseCard` cover everything except the header bar and the decorative footer. New file `components/site-header.tsx` holds the header (also presentational, Server-safe). No new card/button variants.
3. **Course icons are inline presentational blocks.** The three card icons (black "N", Docker whale, blue "TS") are per-course artwork, not a component prop in the system. Render as inline `icon={…}` nodes passed to `CourseCard` (styled `span`/SVG), matching the design-system showcase pattern. No image assets, no `/public` additions.
4. **Avatar is a placeholder circle.** No user/auth in this task. Render a neutral `CircleUser`-style placeholder (lucide) or initials block, not a real photo, and call it out in the report.
5. **Warm page background matched with existing tokens.** The PNG hero reads warm off-white vs the system `neutral-50 #FAFAFC`. Prefer `bg-white` + `bg-neutral-50` banding from the token set over inventing a cream hex. If the diff clearly needs the cream, add one `--color-cream` token to `globals.css` and note it — sheet still wins on everything else.
6. **Bottom bars are CSS decoration.** The peach gradient bars are pure decoration: absolutely-positioned `div`s with `primary-200/300` gradients + blur, `aria-hidden`, no images.
7. **Responsive without a mobile reference.** Desktop matches PNG exactly (max-w-6xl, 3-col grid). Below `md`, stack cards to 1 col, center hero text, collapse nav links behind a minimal menu or hide them keeping logo + avatar visible. No mobile design to match, so sensible stacking only.
8. **Links are placeholder hrefs.** `Courses` → `/courses`, `My Learning` → `/my-learning`, `View all courses` → `/courses`, `Explore Courses` → `/courses`. Routes need not exist yet; no 404 handling in this task.

## Files to touch

| File | Action |
|---|---|
| `app/page.tsx` | Rewrite: header + hero + search + All Courses + divider + decoration, static mock data for 3 cards |
| `components/site-header.tsx` | New: logo, Courses / My Learning nav, bell, avatar placeholder (Server-safe) |
| `app/globals.css` | Only if the cream background cannot be matched with tokens: add one documented token, nothing else |
| `app/layout.tsx` | No change expected (fonts/metadata already correct) |

Explicitly out of scope: Sanity client, search route, Clerk, PostHog, `/courses` or `/my-learning` routes, real course data.

## Requirements

**Header** — white bar, bottom `border-neutral-200` hairline. Left: `Logo`. Center-left nav: `Courses`, `My Learning` (`type-body`, `neutral-900`, hover `primary-500`). Right: bell (`lucide Bell`, `size-5`, `neutral-700`, `aria-label="Notifications"`, presentational button) + avatar placeholder circle (`size-9 rounded-full bg-neutral-200`, `aria-hidden` or initials). Height ~64px, `max-w-6xl` container, `px-6`.

**Hero** — centered, `py-16/20`. Eyebrow: uppercase `type-small` semibold tracking-widest `text-primary-500` on `bg-primary-100` pill (`rounded-full px-3 py-1`, border `primary-200`): "INTELLIGENT LEARNING". Headline: `type-display-1` (Playfair bold 48/56), centered, two lines: "Search your learning / in plain English." Subcopy: `type-body-lg text-neutral-500`, centered, max-w-xl: "Vertex understands what you want to learn and finds the exact lessons across all your courses." CTA: `ButtonLink href="/courses" variant="primary" size="lg"` with trailing `ArrowRight size-4`: "Explore Courses". Search: `SearchInput placeholder="Ask anything about your learning..." aria-label="Search your learning"` full-width max-w-2xl centered, `mt-8`.

**All Courses** — section on `bg-neutral-50` (or white if tokens dictate), `max-w-6xl px-6 py-12`. Row: left `type-display-2` (Playfair 36/44) "All Courses"; right text link `text-primary-500 type-body font-medium` with `ArrowRight`: "View all courses" → `/courses`. Grid: `grid gap-4 md:grid-cols-3`, three `CourseCard`s:
1. icon black rounded `N`, title "Next.js for Production", summary "Build scalable, high-performance web applications with Next.js.", meta Intermediate / 18h 24m / 12 modules.
2. icon Docker whale (inline SVG or lucide approximation in blue), title "Docker Essentials", summary "Containerize applications and streamline your development workflow.", meta Beginner / 10h 12m / 8 modules.
3. icon blue rounded `TS`, title "TypeScript Deep Dive", summary "Go beyond the basics and write safer, more expressive code.", meta Intermediate / 14h 36m / 10 modules.
Meta icons exactly `level/duration/lessons` via `CourseCard` `meta` prop.

**Weekly note** — centered divider row: hairline `border-neutral-200` lines either side, `Star size-4 text-primary-500`, text `type-body text-neutral-700` "New courses and lessons added every week."

**Bottom decoration** — `aria-hidden` row of peach vertical bars (`bg-gradient-to-t from-primary-200/80 to-transparent`, varying heights/widths, `blur-[1px]`), pinned to section bottom, `overflow-hidden`, no layout shift, no horizontal scroll.

**A11y/responsive** — semantic `header/main/section`, single `h1` (hero headline), `h2` for "All Courses", `h3` inside cards (from `CourseCard`). Focus-visible rings from base layer preserved. 375px wide: no overflow, cards stack, hero type wraps, header keeps logo + icons.

## Security

No auth, no tokens, no env, no network, no LLM, no writes. Concretely: no `NEXT_PUBLIC_*` additions, no Sanity/Clerk/PostHog imports, static mock data inline in the Server Component, all new markup Server-safe with no `"use client"`. This introduces none of the §12 risks.

## Acceptance criteria

1. `/` renders header, hero, search, 3 course cards, weekly note, decoration with no console errors or hydration warnings.
2. Desktop matches `design/vertex-home.png` layout, spacing, type (Playfair headline, Inter body), and orange primary CTA/links.
3. All styling via existing tokens/primitives; any new token is documented and minimal.
4. `CourseCard`, `SearchInput`, `ButtonLink`, `Logo` reused — not reimplemented inline.
5. Page is a Server Component; no `"use client"` added.
6. Type check and lint pass; production build passes (route change).
7. 375px viewport: no horizontal overflow, stacked cards, readable hero.

## Checks to run

From `C:\Users\HP\Desktop\vertex`:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Paste real output. Never claim a check passed without running it. Dev-server visual diff is manual (see below).

## Manual test steps

1. `npm run dev`, open `http://localhost:3000/`.
2. Side-by-side against `design/vertex-home.png`: header order/spacing, eyebrow pill, two-line Playfair headline, gray subcopy, orange CTA with arrow, search with ⌘K, "All Courses" + orange link right, 3 cards with correct titles/summaries/meta, star divider line, peach bars at bottom.
3. Open `http://localhost:3000/` at 375px wide: header compact, hero centered, search full-width, cards stack 1-col, no horizontal scroll.
4. Tab through: focus ring visible on nav links, CTA, search input, "View all courses"; bell is a labelled button; disabled states n/a.
5. Confirm `/design-system` still renders unchanged (no token regression).
