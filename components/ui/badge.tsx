import type { ReactNode } from "react";

/* §09 Badges / Tags — video, lesson, popular.
   Uppercase, letterspaced, small.
   Pure presentational: no "use client" needed.
*/

export type BadgeVariant = "video" | "lesson" | "popular";

const variants: Record<BadgeVariant, string> = {
  video: "bg-primary-100 text-primary-500",
  lesson: "bg-indigo-50 text-indigo-600",
  popular: "bg-primary-100 text-primary-500",
};

export function Badge({
  variant = "video",
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-xs px-2 py-0.5 text-small font-semibold uppercase tracking-wider ${variants[variant]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
