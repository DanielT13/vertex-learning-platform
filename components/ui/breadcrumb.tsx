import { ChevronRight } from "lucide-react";
import Link from "next/link";

/* §13 Navigation — breadcrumbs and pagination.
   Pure presentational: no "use client" needed.
*/

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="type-body text-neutral-500 transition-colors hover:text-primary-500"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    last
                      ? "type-body font-medium text-neutral-900"
                      : "type-body text-neutral-500"
                  }
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <ChevronRight
                  className="size-3.5 shrink-0 text-neutral-300"
                  strokeWidth={2}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export type PageLink = {
  label: string;
  href: string;
  /** The active page is outlined in the sheet. */
  isCurrent?: boolean;
};

export function Pagination({
  previous,
  pages,
  next,
  className,
}: {
  previous?: PageLink;
  pages: PageLink[];
  next?: PageLink;
  className?: string;
}) {
  const navLink =
    "inline-flex size-8 items-center justify-center rounded-sm text-body text-neutral-700 transition-colors hover:bg-neutral-100";

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center gap-1 ${className ?? ""}`}
    >
      {previous ? (
        <Link
          href={previous.href}
          className={navLink}
          aria-label="Previous page"
        >
          <ChevronRight
            className="size-4 rotate-180"
            strokeWidth={2}
            aria-hidden
          />
        </Link>
      ) : (
        <span className={navLink} aria-hidden>
          <ChevronRight className="size-4 rotate-180" />
        </span>
      )}

      {pages.map((page) => {
        const current = page.isCurrent === true;
        return (
          <Link
            key={page.label}
            href={page.href}
            aria-current={current ? "page" : undefined}
            className={
              current
                ? "inline-flex size-8 items-center justify-center rounded-sm border border-primary-500 text-body font-medium text-primary-500"
                : navLink
            }
          >
            {page.label}
          </Link>
        );
      })}

      <span aria-hidden className="px-1 text-body text-neutral-500">
        …
      </span>

      {next ? (
        <Link href={next.href} className={navLink} aria-label="Next page">
          <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
        </Link>
      ) : (
        <span className={navLink} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
