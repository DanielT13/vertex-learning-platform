import { ChevronDown, Search } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

/* §08 Inputs
   Height 44px · radius 12px · border 1px solid #E2E8F0 · padding 0 16px
   Focus border #FB923C · placeholder #FB923C
   Pure presentational: no "use client" needed.
*/

const field =
  "h-11 w-full rounded-md border border-neutral-200 bg-white px-4 " +
  "transition-colors placeholder:text-primary-400 " +
  "focus:border-primary-400 focus:outline-none";

export function SearchInput({
  className,
  shortcut = "K",
  ...rest
}: { shortcut?: string } & ComponentProps<"input">) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-500"
        strokeWidth={2}
        aria-hidden
      />
      <input
        type="search"
        className={`${field} pr-20 pl-11 text-body-lg text-neutral-900`}
        {...rest}
      />
      <kbd className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded-xs border border-neutral-200 bg-white px-1.5 py-0.5 text-small text-neutral-500">
        <span aria-hidden>⌘</span>
        {shortcut}
      </kbd>
    </div>
  );
}

export function TextInput({
  className,
  ...rest
}: ComponentProps<"input">) {
  return (
    <input
      className={`${field} text-body-lg text-neutral-900 ${className ?? ""}`}
      {...rest}
    />
  );
}

export function Select({
  className,
  children,
  ...rest
}: { children: ReactNode } & ComponentProps<"select">) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <select
        className={`${field} cursor-pointer appearance-none pr-11 font-medium text-neutral-900`}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-700"
        strokeWidth={2}
        aria-hidden
      />
    </div>
  );
}
