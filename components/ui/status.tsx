import {
  CheckCircle2,
  CircleDashed,
  Lock,
  PlayCircle,
} from "lucide-react";

/* §10 Status / Indicators
   In progress (spinning orange arc) · Completed (green check)
   Now playing (filled orange play) · Locked (grey lock)
   Pure presentational: no "use client" needed.
*/

export type StatusKind = "in-progress" | "completed" | "now-playing" | "locked";

const kindConfig: Record<
  StatusKind,
  {
    label: string;
    Icon: typeof CheckCircle2;
    className: string;
    spin?: boolean;
  }
> = {
  "in-progress": {
    label: "In Progress",
    Icon: CircleDashed,
    className: "text-primary-500",
    spin: true,
  },
  completed: {
    label: "Completed",
    Icon: CheckCircle2,
    className: "text-emerald-600",
  },
  "now-playing": {
    label: "Now Playing",
    Icon: PlayCircle,
    className: "text-primary-500",
  },
  locked: {
    label: "Locked",
    Icon: Lock,
    className: "text-neutral-500",
  },
};

export function StatusIndicator({
  kind,
  className,
}: {
  kind: StatusKind;
  className?: string;
}) {
  const { label, Icon, className: tone, spin } = kindConfig[kind];
  return (
    <span
      className={`inline-flex items-center gap-2 text-body ${tone} ${className ?? ""}`}
    >
      <Icon
        className={`size-4 ${spin ? "animate-spin [animation-duration:2s]" : ""}`}
        strokeWidth={2}
        aria-hidden
      />
      <span className="font-medium">{label}</span>
    </span>
  );
}
