import Link from "next/link";
import { Bell, User } from "lucide-react";
import { Logo } from "@/components/ui/logo";

/* Site header: Vertex lockup + Courses / My Learning nav + bell + avatar.
   Pure presentational Server Component: no "use client" needed. */

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link href="/" aria-label="Vertex home">
            <Logo />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            <Link
              href="/courses"
              className="type-body font-medium text-neutral-900 transition-colors hover:text-primary-500"
            >
              Courses
            </Link>
            <Link
              href="/my-learning"
              className="type-body font-medium text-neutral-900 transition-colors hover:text-primary-500"
            >
              My Learning
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="flex size-9 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <Bell className="size-5" strokeWidth={2} aria-hidden />
          </button>
          {/* Placeholder avatar: no auth in this task, no photo asset. */}
          <span
            aria-hidden
            className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-neutral-200 text-neutral-500"
          >
            <User className="size-5" strokeWidth={2} />
          </span>
        </div>
      </div>
      {/* Mobile nav: stacked row under the bar, keeps links reachable. */}
      <nav
        aria-label="Primary mobile"
        className="flex items-center gap-6 border-t border-neutral-100 px-6 py-2 md:hidden"
      >
        <Link
          href="/courses"
          className="type-body font-medium text-neutral-900 transition-colors hover:text-primary-500"
        >
          Courses
        </Link>
        <Link
          href="/my-learning"
          className="type-body font-medium text-neutral-900 transition-colors hover:text-primary-500"
        >
          My Learning
        </Link>
      </nav>
    </header>
  );
}
