"use client";

import { useState } from "react";
import { Lightbulb, Plus, Trash2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FieldGuideContent {
  points: string[];
  example: string;
}

/** Label + control + optional hint, with consistent spacing everywhere. */
export function Field({
  label,
  htmlFor,
  hint,
  guide,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  /** Writing guidance. Adds a "View hint" toggle beside the label. */
  guide?: FieldGuideContent;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-2.5">
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </Label>

        {guide && (
          <button
            type="button"
            onClick={() => setGuideOpen((value) => !value)}
            aria-expanded={guideOpen}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-blue transition-opacity hover:opacity-80"
          >
            <Lightbulb className="size-3.5" />
            {guideOpen ? "Hide hint" : "View hint"}
          </button>
        )}
      </div>

      {guide && guideOpen && <FieldGuidePanel {...guide} />}

      {children}
      {hint && (
        <p className="text-xs leading-relaxed text-subtle-foreground">{hint}</p>
      )}
    </div>
  );
}

/**
 * The guidance itself: a couple of short points and one worked example. The
 * example carries most of the weight, so the prose stays short enough to read.
 */
function FieldGuidePanel({ points, example }: FieldGuideContent) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-3.5">
      <ul className="flex list-disc flex-col gap-1 pl-4 text-sm leading-relaxed text-muted-foreground">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      <div className="mt-2">
        <p className="text-[0.7rem] text-brand-coral font-semibold uppercase tracking-wider ">
          Example
        </p>
        <p className="mt-1 text-sm leading-relaxed text-foreground">
          {example}
        </p>
      </div>
    </div>
  );
}

/** Two fields side by side on anything wider than a phone. */
export function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  );
}

/** One repeatable entry (a job, a degree, …). */
export function EntryCard({
  title,
  index,
  onDelete,
  deleteLabel,
  children,
}: {
  title: string;
  index: number;
  onDelete: () => void;
  deleteLabel: string;
  children: React.ReactNode;
}) {
  return (
    <li className="group relative rounded-xl border border-border bg-card p-4 shadow-soft-xs transition-shadow duration-200 focus-within:shadow-soft-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-6 shrink-0 place-items-center rounded-md bg-muted text-[0.7rem] font-semibold tabular-nums text-muted-foreground">
            {index + 1}
          </span>
          <h4 className="truncate text-sm font-semibold text-foreground">
            {title}
          </h4>
        </div>
        <Button
          onClick={onDelete}
          variant="destructive"
          size="icon-sm"
          aria-label={deleteLabel}
          title={deleteLabel}
          className="shrink-0 opacity-60 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Trash2 />
        </Button>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </li>
  );
}

/** Shown in place of the list when a section has no entries yet. */
export function SectionEmpty({
  icon: Icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border-strong bg-card/40 px-6 py-10 text-center">
      <span className="grid size-11 place-items-center rounded-xl bg-muted">
        <Icon className="size-5 text-subtle-foreground" />
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
      <Button onClick={onAction} size="sm">
        <Plus />
        {actionLabel}
      </Button>
    </div>
  );
}

/** The "add another" button under a non-empty list. */
export function AddMoreButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-transparent px-4 py-3.5",
        "text-sm font-medium text-muted-foreground transition-colors duration-150",
        "hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
      )}
    >
      <Plus className="size-4" />
      {label}
    </button>
  );
}
