import { ArrowRight, Container, Star } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { CourseCard } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";

/* Vertex Home — Server Component, presentational only.
   Static mock data for the 3 visible cards; real data arrives with Sanity. */

export default function Home() {
  return (
    <div className="min-h-full bg-white">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-12 text-center md:pt-20">
            <p className="inline-flex items-center rounded-full border border-primary-200 bg-primary-100 px-3 py-1 type-small font-semibold uppercase tracking-widest text-primary-500">
              Intelligent Learning
            </p>
            <h1 className="type-display-1 mx-auto mt-6 max-w-2xl text-neutral-900">
              Search your learning
              <br />
              in plain English.
            </h1>
            <p className="type-body-lg mx-auto mt-4 max-w-xl text-neutral-500">
              Vertex understands what you want to learn and finds the exact
              lessons across all your courses.
            </p>
            <div className="mt-8">
              <ButtonLink href="/courses" variant="primary" size="lg">
                Explore Courses
                <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
              </ButtonLink>
            </div>
            <div className="mx-auto mt-10 max-w-2xl">
              <SearchInput
                placeholder="Ask anything about your learning..."
                aria-label="Search your learning"
              />
            </div>
          </div>
        </section>

        {/* All Courses */}
        <section className="bg-neutral-50">
          <div className="mx-auto max-w-[1440px] px-6 py-12">
            <div className="flex items-center justify-between gap-4">
              <h2 className="type-display-2 text-neutral-900">All Courses</h2>
              <ButtonLink
                href="/courses"
                variant="text"
                size="md"
                className="shrink-0"
              >
                View all courses
                <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
              </ButtonLink>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
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
              <CourseCard
                icon={
                  <span className="flex size-12 items-center justify-center rounded-md bg-[#2496ED] text-white">
                    <Container className="size-6" strokeWidth={2} aria-hidden />
                  </span>
                }
                title="Docker Essentials"
                summary="Containerize applications and streamline your development workflow."
                meta={[
                  { icon: "level", value: "Beginner" },
                  { icon: "duration", value: "10h 12m" },
                  { icon: "lessons", value: "8 modules" },
                ]}
              />
              <CourseCard
                icon={
                  <span className="flex size-12 items-center justify-center rounded-md bg-[#3178C6] text-heading-2 font-semibold text-white">
                    TS
                  </span>
                }
                title="TypeScript Deep Dive"
                summary="Go beyond the basics and write safer, more expressive code."
                meta={[
                  { icon: "level", value: "Intermediate" },
                  { icon: "duration", value: "14h 36m" },
                  { icon: "lessons", value: "10 modules" },
                ]}
              />
            </div>

            {/* Weekly note */}
            <div className="mt-10 flex items-center gap-4">
              <span aria-hidden className="h-px flex-1 bg-neutral-200" />
              <Star
                className="size-4 shrink-0 text-primary-500"
                strokeWidth={2}
                aria-hidden
              />
              <p className="type-body shrink-0 text-neutral-700">
                New courses and lessons added every week.
              </p>
              <span aria-hidden className="h-px flex-1 bg-neutral-200" />
            </div>
          </div>

          {/* Bottom decoration: peach bars, pure CSS, hidden from AT. */}
          <div
            aria-hidden
            className="overflow-hidden"
          >
            <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-2 px-6">
              <div className="flex flex-1 items-end gap-2">
                <div className="h-16 w-full bg-gradient-to-t from-primary-300/70 to-transparent blur-[1px]" />
                <div className="h-28 w-full bg-gradient-to-t from-primary-300/70 to-transparent blur-[1px]" />
                <div className="h-40 w-full bg-gradient-to-t from-primary-200/90 to-transparent blur-[1px]" />
                <div className="h-32 w-full bg-gradient-to-t from-primary-300/70 to-transparent blur-[1px]" />
                <div className="h-24 w-full bg-gradient-to-t from-primary-200/80 to-transparent blur-[1px]" />
              </div>
              <div className="w-16 shrink-0" />
              <div className="flex flex-1 items-end gap-2">
                <div className="h-20 w-full bg-gradient-to-t from-primary-200/80 to-transparent blur-[1px]" />
                <div className="h-32 w-full bg-gradient-to-t from-primary-300/70 to-transparent blur-[1px]" />
                <div className="h-44 w-full bg-gradient-to-t from-primary-200/90 to-transparent blur-[1px]" />
                <div className="h-28 w-full bg-gradient-to-t from-primary-300/70 to-transparent blur-[1px]" />
                <div className="h-36 w-full bg-gradient-to-t from-primary-200/80 to-transparent blur-[1px]" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
