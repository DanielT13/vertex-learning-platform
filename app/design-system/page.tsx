import {
  BarChart3,
  Bell,
  BookOpen,
  Bookmark,
  Check,
  CircleUser,
  Clock,
  Eye,
  FileText,
  Grid2x2,
  Layers,
  PlayCircle,
  Search,
  Star,
  Target,
  Type,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumbs,
  Pagination,
  type Crumb,
  type PageLink,
} from "@/components/ui/breadcrumb";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  CourseCard,
  LessonCardLesson,
  LessonCardVideo,
  ResourceCard,
} from "@/components/ui/card";
import { SearchInput, Select } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { ProgressBar } from "@/components/ui/progress";
import { StatusIndicator } from "@/components/ui/status";

/* Renders all 14 sections of design/vertex-designsystem.png in sheet order,
   so the implementation can be diffed against the reference.
   Server Component: no "use client" — everything below is presentational. */

/* Swatches reference the real token classes, so the ramp proves the tokens
   resolve rather than restating a hex inline. */
const primaryRamp = [
  { step: "500", hex: "#F97316", className: "bg-primary-500" },
  { step: "400", hex: "#FB923C", className: "bg-primary-400" },
  { step: "300", hex: "#FDBA74", className: "bg-primary-300" },
  { step: "200", hex: "#FED7AA", className: "bg-primary-200" },
  { step: "100", hex: "#FFEFE5", className: "bg-primary-100" },
];

const neutralRamp = [
  { step: "900", hex: "#0F172A", className: "bg-neutral-900" },
  { step: "700", hex: "#334155", className: "bg-neutral-700" },
  { step: "500", hex: "#64748B", className: "bg-neutral-500" },
  { step: "300", hex: "#CBD5E1", className: "bg-neutral-300" },
  { step: "200", hex: "#E2E8F0", className: "bg-neutral-200" },
  { step: "100", hex: "#F1F5F9", className: "bg-neutral-100" },
  { step: "50", hex: "#FAFAFC", className: "bg-neutral-50" },
  { step: "White", hex: "#FFFFFF", className: "bg-white" },
];

/* Square size comes from the spacing scale, so this section verifies
   --spacing resolves rather than hardcoding a px value. */
const spacingSteps = [
  { px: 4, rem: "0.25rem", className: "size-1" },
  { px: 8, rem: "0.5rem", className: "size-2" },
  { px: 12, rem: "0.75rem", className: "size-3" },
  { px: 16, rem: "1rem", className: "size-4" },
  { px: 24, rem: "1.5rem", className: "size-6" },
  { px: 32, rem: "2rem", className: "size-8" },
  { px: 40, rem: "2.5rem", className: "size-10" },
  { px: 48, rem: "3rem", className: "size-12" },
  { px: 64, rem: "4rem", className: "size-16" },
];

/* Class names are written out in full: Tailwind scans source for literal
   class strings, so a `rounded-${token}` template would never emit rounded-xl. */
const radii = [
  { label: "4px", token: "xs", className: "rounded-xs" },
  { label: "8px", token: "sm", className: "rounded-sm" },
  { label: "12px", token: "md", className: "rounded-md" },
  { label: "16px", token: "lg", className: "rounded-lg" },
  { label: "24px", token: "xl", className: "rounded-xl" },
  { label: "Full", token: "full", className: "rounded-full" },
];

const shadows = [
  { label: "Sm", value: "shadow-sm" },
  { label: "Md", value: "shadow-md" },
  { label: "Lg", value: "shadow-lg" },
  { label: "Xl", value: "shadow-xl" },
];

const typeScale = [
  { name: "Display 1", font: "Playfair Display", spec: "48 / 56", weight: "Bold", use: "Page titles", cls: "type-display-1" },
  { name: "Display 2", font: "Playfair Display", spec: "36 / 44", weight: "Bold", use: "Section titles", cls: "type-display-2" },
  { name: "Heading 1", font: "Inter", spec: "28 / 36", weight: "Semi Bold", use: "Card titles", cls: "type-heading-1" },
  { name: "Heading 2", font: "Inter", spec: "22 / 30", weight: "Semi Bold", use: "Sub section", cls: "type-heading-2" },
  { name: "Heading 3", font: "Inter", spec: "18 / 26", weight: "Medium", use: "Small titles", cls: "type-heading-3" },
  { name: "Body Large", font: "Inter", spec: "16 / 24", weight: "Regular", use: "Body copy", cls: "type-body-lg" },
  { name: "Body", font: "Inter", spec: "14 / 20", weight: "Regular", use: "Supporting text", cls: "type-body" },
  { name: "Small", font: "Inter", spec: "12 / 16", weight: "Regular", use: "Captions, meta", cls: "type-small" },
];

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="mb-5 flex items-baseline gap-3">
        <span className="text-small font-semibold text-primary-500">
          {number}
        </span>
        <span className="type-heading-3 uppercase tracking-wider text-neutral-900">
          {title}
        </span>
      </h2>
      {children}
    </section>
  );
}

function Swatch({ className }: { className: string }) {
  return (
    <div
      className={`h-16 w-full rounded-sm border border-neutral-200 ${className}`}
    />
  );
}

/* The sheet shows Default / Hover / Disabled side by side, but :hover cannot
   be triggered on demand in a static showcase. HoverPreview isolates the
   simulated hover appearance so it is never mistaken for the component's real
   :hover rule (which works live — see §15). */
function HoverPreview({ children }: { children: React.ReactNode }) {
  return (
    <div data-preview="hover" className="[&>*]:bg-primary-400">
      {children}
    </div>
  );
}

const crumbs: Crumb[] = [
  { label: "All Courses", href: "#" },
  { label: "Next.js for Production", href: "#" },
  { label: "Data Fetching & Caching" },
];

const pages: PageLink[] = [
  { label: "1", href: "#", isCurrent: true },
  { label: "2", href: "#" },
  { label: "3", href: "#" },
  { label: "8", href: "#" },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-full bg-neutral-50">
      {/* Masthead */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[320px_1fr]">
          <div>
            <Logo />
            <h1 className="type-display-1 mt-6 text-neutral-900">
              Design System
            </h1>
            <p className="type-body-lg mt-4 max-w-xs text-neutral-500">
              A unified design language for the Vertex learning platform. Clean,
              modern and focused on clarity, consistency and intuitive learning
              experiences.
            </p>
            <p className="type-small mt-6 uppercase tracking-widest text-neutral-500">
              Version 1.0 · May 2025
            </p>
          </div>

          {/* 01 Colors */}
          <div className="space-y-8">
            <div>
              <h3 className="type-heading-3 mb-3 text-neutral-900">Primary</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {primaryRamp.map((c) => (
                  <div key={c.step}>
                    <Swatch className={c.className} />
                    <p className="type-small mt-2 text-neutral-900">
                      Primary {c.step}
                    </p>
                    <p className="text-small text-neutral-500">{c.hex}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="type-heading-3 mb-3 text-neutral-900">Neutral</h3>
              <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
                {neutralRamp.map((c) => (
                  <div key={c.step}>
                    <Swatch className={c.className} />
                    <p className="type-small mt-2 truncate text-neutral-900">
                      {c.step === "White" ? "White" : `Neutral ${c.step}`}
                    </p>
                    <p className="text-small text-neutral-500">{c.hex}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-6 py-8">
        <div className="grid gap-4 md:grid-cols-2">
          {/* 02 Typography */}
          <Section number="02" title="Typography">
            <div className="space-y-6">
              <div>
                <p className="type-display-1 text-neutral-900">Ag</p>
                <p className="type-heading-2 mt-2 text-neutral-900">
                  Playfair Display
                </p>
                <p className="type-small text-neutral-500">
                  Elegant · Readable · Timeless
                </p>
              </div>
              <div>
                {/* Explicit Inter specimen class: never stack font-sans on top
                    of type-display-1, the cascade winner would be accidental. */}
                <p className="font-sans text-[48px] leading-[56px] font-semibold text-neutral-900">
                  Ag
                </p>
                <p className="type-heading-2 mt-2 text-neutral-900">Inter</p>
                <p className="type-small text-neutral-500">
                  Clean · Modern · Highly legible
                </p>
              </div>
            </div>
          </Section>

          {/* 03 Type scale */}
          <Section number="03" title="Type Scale">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left">
                  {["Style", "Font", "Size / Line Height", "Weight", "Use"].map(
                    (h) => (
                      <th
                        key={h}
                        className="type-small pb-2 font-medium text-neutral-500"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {typeScale.map((row) => (
                  <tr key={row.name} className="border-b border-neutral-100">
                    <td className={`${row.cls} py-2 text-neutral-900`}>
                      {row.name}
                    </td>
                    <td className="type-small py-2 text-neutral-500">
                      {row.font}
                    </td>
                    <td className="type-small py-2 text-neutral-500">
                      {row.spec}
                    </td>
                    <td className="type-small py-2 text-neutral-500">
                      {row.weight}
                    </td>
                    <td className="type-small py-2 text-neutral-500">
                      {row.use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* 04 Spacing */}
          <Section number="04" title="Spacing System">
            <p className="type-body mb-4 text-neutral-700">Base unit: 4px</p>
            <div className="flex items-end gap-3">
              {spacingSteps.map((s) => (
                <div key={s.px} className="text-center">
                  <div
                    className={`rounded-xs bg-primary-200 ${s.className}`}
                  />
                  <p className="type-small mt-2 text-neutral-900">{s.px}</p>
                  <p className="text-small text-neutral-500">{s.rem}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* 05 Radius & shadows */}
          <Section number="05" title="Radius & Shadows">
            <h3 className="type-body mb-3 font-semibold text-neutral-900">
              Radius
            </h3>
            <div className="mb-6 flex items-center gap-4">
              {radii.map((r) => (
                <div key={r.token} className="text-center">
                  <div
                    className={`size-12 border border-neutral-300 bg-white ${r.className}`}
                  />
                  <p className="type-small mt-2 text-neutral-900">{r.label}</p>
                  <p className="text-small text-neutral-500">({r.token})</p>
                </div>
              ))}
            </div>
            <h3 className="type-body mb-3 font-semibold text-neutral-900">
              Shadows
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {shadows.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-sm bg-white p-3 ${s.value}`}
                >
                  <p className="type-small font-semibold text-neutral-900">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* 06 Icons */}
          <Section number="06" title="Icons">
            <h3 className="type-body mb-3 text-neutral-700">Outline Style</h3>
            <div className="flex flex-wrap gap-4 text-neutral-900">
              {[
                Bell,
                Search,
                PlayCircle,
                FileText,
                Bookmark,
                BarChart3,
                Clock,
                CircleUser,
                Type,
              ].map((Icon, i) => (
                <Icon
                  key={i}
                  className="size-6"
                  strokeWidth={2}
                  aria-hidden
                />
              ))}
            </div>
            <h3 className="type-body mb-3 mt-5 text-neutral-700">
              Filled Style
            </h3>
            <div className="flex flex-wrap gap-4 text-neutral-900">
              {[
                Bell,
                Search,
                PlayCircle,
                FileText,
                Bookmark,
                BarChart3,
                Clock,
                CircleUser,
                Type,
              ].map((Icon, i) => (
                <Icon
                  key={i}
                  className="size-6"
                  strokeWidth={0}
                  fill="currentColor"
                  aria-hidden
                />
              ))}
            </div>
            <div className="mt-5 space-y-1 border-t border-neutral-100 pt-4">
              {[
                "24×24px grid",
                "2px stroke width (outline)",
                "Rounded line caps",
                "Consistent optical balance",
              ].map((spec) => (
                <p key={spec} className="type-small text-neutral-500">
                  · {spec}
                </p>
              ))}
            </div>
          </Section>

          {/* 07 Buttons */}
          <Section number="07" title="Buttons">
            {/* Honest 5-column grid: visible state labels in column one, so the
                four button columns always align with their headers.
                The matrix scrolls horizontally inside the card instead of
                clipping — the trio layout from the sheet is preserved. */}
            <div className="overflow-x-auto pb-1">
              <div className="min-w-max">
            <div className="grid grid-cols-[64px_1fr_1fr_1fr_1fr] items-center gap-3 pb-2">
              <span />
              {["Primary", "Secondary", "Tertiary", "Text"].map((h) => (
                <span
                  key={h}
                  className="type-small font-medium text-neutral-500"
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-[64px_1fr_1fr_1fr_1fr] items-center gap-3 py-2">
              <span className="type-small text-neutral-500">Default</span>
              <Button>Get Started</Button>
              <Button variant="secondary">Explore</Button>
              <Button variant="tertiary" size="md">
                View Lesson
              </Button>
              <Button variant="text" size="md" className="px-0">
                Watch Video
              </Button>
            </div>
            <div className="grid grid-cols-[64px_1fr_1fr_1fr_1fr] items-center gap-3 py-2">
              <span className="type-small text-neutral-500">Hover</span>
              <HoverPreview>
                <Button>Get Started</Button>
              </HoverPreview>
              <HoverPreview>
                <Button variant="secondary">Explore</Button>
              </HoverPreview>
              <HoverPreview>
                <Button variant="tertiary" size="md">
                  View Lesson
                </Button>
              </HoverPreview>
              <HoverPreview>
                <Button variant="text" size="md" className="px-0">
                  Watch Video
                </Button>
              </HoverPreview>
            </div>
            <div className="grid grid-cols-[64px_1fr_1fr_1fr_1fr] items-center gap-3 py-2">
              <span className="type-small text-neutral-500">Disabled</span>
              <Button disabled>Get Started</Button>
              <Button variant="secondary" disabled>
                Explore
              </Button>
              <Button variant="tertiary" size="md" disabled>
                View Lesson
              </Button>
              <Button variant="text" size="md" disabled className="px-0">
                Watch Video
              </Button>
            </div>
              </div>
            </div>
            <div className="mt-4 space-y-1 border-t border-neutral-100 pt-4">
              {[
                "Height: 44px (default)",
                "Padding: 0 16px (lg), 0 12px (md)",
                "Radius: 12px",
                "Font: Inter Medium (14–16px)",
              ].map((spec) => (
                <p key={spec} className="type-small text-neutral-500">
                  · {spec}
                </p>
              ))}
            </div>
          </Section>

          {/* 08 Inputs */}
          <Section number="08" title="Inputs">
            <h3 className="type-body mb-2 font-medium text-neutral-700">
              Search / Text Input
            </h3>
            <SearchInput placeholder="Search anything..." />
            <h3 className="type-body mb-2 mt-5 font-medium text-neutral-700">
              Select
            </h3>
            <Select defaultValue="relevant" aria-label="Sort results">
              <option value="relevant">Most Relevant</option>
              <option value="newest">Newest</option>
              <option value="duration">Shortest</option>
            </Select>
            <div className="mt-5 space-y-1 border-t border-neutral-100 pt-4">
              {[
                "Height: 44px",
                "Radius: 12px",
                "Border: 1px solid #E2E8F0",
                "Padding: 0 16px",
                "Focus: border color #FB923C",
              ].map((spec) => (
                <p key={spec} className="type-small text-neutral-500">
                  · {spec}
                </p>
              ))}
            </div>
          </Section>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* 09 Badges */}
          <Section number="09" title="Badges / Tags">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="video">Video</Badge>
              <Badge variant="lesson">Lesson</Badge>
              <Badge variant="popular">Popular</Badge>
            </div>
          </Section>

          {/* 10 Status */}
          <Section number="10" title="Status / Indicators">
            <div className="flex flex-wrap items-center gap-5">
              <StatusIndicator kind="in-progress" />
              <StatusIndicator kind="completed" />
              <StatusIndicator kind="now-playing" />
              <StatusIndicator kind="locked" />
            </div>
          </Section>

          {/* 11 Progress */}
          <Section number="11" title="Progress Bar">
            <ProgressBar value={35} label />
          </Section>
        </div>

        {/* 12 Cards */}
        <Section number="12" title="Cards">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CourseCard
              icon={
                <span className="flex size-12 items-center justify-center rounded-md bg-neutral-900 text-heading-2 font-semibold text-white">
                  N
                </span>
              }
              title="Next.js for Production"
              summary="Build scalable, high-performance web applications with Next.js."
              meta={[
                { icon: "level", value: "Intermediate" },
                { icon: "duration", value: "18h 24m" },
                { icon: "lessons", value: "12 modules" },
              ]}
            />
            <LessonCardVideo
              course="Next.js for Production"
              title="Data Fetching in Server Components"
              summary="Learn how to fetch data on the server using async/await and Next.js best practices for better performance."
              label="Lesson 5.1"
              module="Data Fetching & Caching"
              timestamp="12:45"
            />
            <LessonCardLesson
              course="Next.js for Production"
              title="Data Fetching & Caching"
              summary="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
              module="Module 5"
              keyPoints={[
                "Fetching strategies",
                "Caching techniques",
                "Revalidation methods",
              ]}
            />
            <ResourceCard
              title="Caching and Revalidation Guide"
              description="Deep dive into Next.js caching strategies."
              meta="PDF · 1.2 MB"
            />
          </div>
        </Section>

        {/* 13 Navigation */}
        <Section number="13" title="Navigation">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Logo />
            </div>
            <div>
              <h3 className="type-body mb-3 font-medium text-neutral-700">
                Breadcrumbs
              </h3>
              <Breadcrumbs items={crumbs} />
            </div>
            <div>
              <h3 className="type-body mb-3 font-medium text-neutral-700">
                Pagination
              </h3>
              <Pagination
                previous={{ label: "Previous", href: "#" }}
                pages={pages}
                next={{ label: "Next", href: "#" }}
              />
            </div>
          </div>
        </Section>

        {/* 14 Principles */}
        <Section number="14" title="Principles">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                Icon: Eye,
                title: "Clarity First",
                text: "Every element should communicate clearly.",
              },
              {
                Icon: Grid2x2,
                title: "Consistency",
                text: "Use components and patterns consistently across the platform.",
              },
              {
                Icon: Target,
                title: "Focus & Calm",
                text: "Remove noise and help learners focus on what matters.",
              },
              {
                Icon: Layers,
                title: "Accessible",
                text: "Design with accessibility and inclusivity in mind.",
              },
            ].map(({ Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon
                  className="mt-0.5 size-5 shrink-0 text-neutral-700"
                  strokeWidth={2}
                  aria-hidden
                />
                <div>
                  <p className="type-body font-semibold text-neutral-900">
                    {title}
                  </p>
                  <p className="type-small mt-1 text-neutral-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Live component samples, wired up — not part of the 14 sheet sections */}
        <Section number="15" title="Live Samples">
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="#" variant="primary" size="lg">
              Get Started
              <Star className="size-4" strokeWidth={2} aria-hidden />
            </ButtonLink>
            <ButtonLink href="#" variant="secondary" size="lg">
              Explore Courses
            </ButtonLink>
            <ButtonLink href="#" variant="tertiary" size="lg">
              View Lesson
            </ButtonLink>
            <ButtonLink href="#" variant="text" size="lg">
              Watch Video
              <PlayCircle className="size-4" strokeWidth={2} aria-hidden />
            </ButtonLink>
            <Button disabled>Get Started</Button>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Check
                className="size-4 shrink-0 text-primary-500"
                strokeWidth={2}
                aria-hidden
              />
              <p className="type-body text-neutral-700">
                Understand the different data fetching methods in Next.js
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Check
                className="size-4 shrink-0 text-primary-500"
                strokeWidth={2}
                aria-hidden
              />
              <p className="type-body text-neutral-700">
                Learn how caching works in Server Components
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-md border border-primary-200 bg-primary-100 p-4">
            <BookOpen
              className="size-5 shrink-0 text-primary-500"
              strokeWidth={2}
              aria-hidden
            />
            <div>
              <p className="type-body font-semibold text-neutral-900">
                Pro Tip
              </p>
              <p className="type-small mt-1 text-neutral-700">
                Use caching and revalidation wisely to ensure your app stays
                fast and data remains fresh.
              </p>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
