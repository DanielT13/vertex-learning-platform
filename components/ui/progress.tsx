/* §11 Progress bar
   4px track in neutral-100 · fill in primary-500 · rounded ends
   Pure presentational: no "use client" needed.
*/

export function ProgressBar({
  value,
  label,
  className,
}: {
  /** Completion from 0 to 100. */
  value: number;
  /** Optional trailing percentage, as shown in the sheet. */
  label?: boolean;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1 w-full overflow-hidden rounded-full bg-neutral-100"
      >
        <div
          className="h-full rounded-full bg-primary-500 transition-[width]"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {label ? (
        <span className="shrink-0 text-small font-medium text-neutral-700">
          {clamped}% complete
        </span>
      ) : null}
    </div>
  );
}
