/* §13 Navigation — the Vertex lockup: orange mark + wordmark.
   Pure presentational: no "use client" needed.
*/

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-6 shrink-0"
        aria-hidden
      >
        {/* Downward triangle, with the counter-cut notch that makes the mark */}
        <path
          d="M12 2.5 22.5 20H1.5L12 2.5Z"
          fill="var(--color-primary-500)"
        />
        <path d="M12 8.4 17.2 17H6.8L12 8.4Z" fill="var(--color-white)" />
      </svg>
      {showWordmark ? (
        <span className="type-heading-2 font-semibold tracking-tight text-neutral-900">
          Vertex
        </span>
      ) : null}
    </span>
  );
}
