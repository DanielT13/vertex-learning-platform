import {
  ArrowUpRight,
  Clock,
  ExternalLink,
  FileText,
  Folder,
  Gauge,
  Play,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "./badge";

/* §12 Cards — course, lesson (video), lesson (lesson), resource.
   Pure presentational: no "use client" needed.
*/

const card = "rounded-lg border border-neutral-200 bg-white";

/* --- Meta row, shared by course and lesson cards (level, duration, count) -- */

export type MetaFact = {
  icon: "level" | "duration" | "lessons" | "students";
  value: string;
};

const metaIcons = {
  level: Gauge,
  duration: Clock,
  lessons: Folder,
  students: Users,
} as const;

export function MetaRow({ items }: { items: MetaFact[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {items.map((item) => {
        const Icon = metaIcons[item.icon];
        return (
          <li
            key={item.icon}
            className="inline-flex items-center gap-1.5 text-small text-neutral-500"
          >
            <Icon className="size-3.5" strokeWidth={2} aria-hidden />
            {item.value}
          </li>
        );
      })}
    </ul>
  );
}

/* --- Course card ---------------------------------------------------------- */

export function CourseCard({
  icon,
  title,
  summary,
  meta,
  className,
}: {
  icon: ReactNode;
  title: string;
  summary: string;
  meta: MetaFact[];
  className?: string;
}) {
  return (
    <article className={`${card} flex flex-col p-5 ${className ?? ""}`}>
      {icon}
      <h3 className="type-display-2 mt-4 text-neutral-900">{title}</h3>
      <p className="type-body mt-2 text-neutral-500">{summary}</p>
      <div className="mt-5 border-t border-neutral-100 pt-4">
        <MetaRow items={meta} />
      </div>
    </article>
  );
}

/* --- Lesson card (video) --------------------------------------------------- */

export function LessonCardVideo({
  title,
  summary,
  course,
  module,
  label,
  timestamp,
  thumbnail,
  action = true,
  className,
}: {
  title: string;
  summary: string;
  course: string;
  module: string;
  /** e.g. "Lesson 5.1" */
  label: string;
  /** e.g. "12:45" */
  timestamp: string;
  thumbnail?: ReactNode;
  action?: boolean;
  className?: string;
}) {
  return (
    <article className={`${card} p-5 ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-4">
        {thumbnail}
        <Badge variant="video">Video</Badge>
      </div>
      <h3 className="type-heading-3 mt-3 text-neutral-900">{title}</h3>
      <p className="type-body mt-1.5 text-neutral-500">{summary}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-small text-neutral-500">
          <span className="font-medium text-neutral-700">{label}</span>
          <span aria-hidden> · </span>
          {timestamp}
          <span aria-hidden> · </span>
          {module}
        </p>
        {action ? (
          <span className="inline-flex items-center gap-1.5 text-body font-medium text-primary-500">
            Watch from {timestamp}
            <Play className="size-3.5" strokeWidth={2} aria-hidden />
          </span>
        ) : null}
      </div>
      <p className="sr-only">{course}</p>
    </article>
  );
}

/* --- Lesson card (lesson) -------------------------------------------------- */

export function LessonCardLesson({
  title,
  summary,
  module,
  keyPoints,
  course,
  className,
}: {
  title: string;
  summary: string;
  module: string;
  keyPoints: string[];
  course: string;
  className?: string;
}) {
  return (
    <article className={`${card} p-5 ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-4">
        <FileText
          className="size-5 text-neutral-500"
          strokeWidth={2}
          aria-hidden
        />
        <Badge variant="lesson">Lesson</Badge>
      </div>
      <h3 className="type-heading-3 mt-3 text-neutral-900">{title}</h3>
      <p className="type-body mt-1.5 text-neutral-500">{summary}</p>
      {keyPoints.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {keyPoints.map((point) => (
            <li key={point} className="type-body text-neutral-700">
              · {point}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-small text-neutral-500">{module}</p>
        <span className="inline-flex items-center gap-1.5 text-body font-medium text-primary-500">
          View lesson
          <ArrowUpRight className="size-3.5" strokeWidth={2} aria-hidden />
        </span>
      </div>
      <p className="sr-only">{course}</p>
    </article>
  );
}

/* --- Resource card --------------------------------------------------------- */

const resourceIcons = {
  document: FileText,
  guide: FileText,
  repository: Folder,
} as const;

export function ResourceCard({
  title,
  description,
  type = "document",
  meta,
  className,
}: {
  title: string;
  description: string;
  type?: keyof typeof resourceIcons;
  /** e.g. "PDF · 1.2 MB" */
  meta?: string;
  className?: string;
}) {
  const Icon = resourceIcons[type];
  return (
    <article
      className={`${card} flex items-start gap-3 p-4 ${className ?? ""}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary-100">
        <Icon
          className="size-4 text-primary-500"
          strokeWidth={2}
          aria-hidden
        />
      </span>
      <div className="min-w-0 flex-1">
        <h4 className="type-body font-semibold text-neutral-900">{title}</h4>
        <p className="type-small mt-0.5 text-neutral-500">{description}</p>
        {meta ? (
          <p className="type-small mt-2 text-neutral-500">{meta}</p>
        ) : null}
      </div>
      <ExternalLink
        className="mt-1 size-4 shrink-0 text-primary-500"
        strokeWidth={2}
        aria-hidden
      />
    </article>
  );
}
