'use client'

import { Minus, Plus, RotateCcw } from 'lucide-react'

import {
  LINE_HEIGHT_RANGE,
  SCALE_RANGE,
  TYPOGRAPHY_DEFAULT,
  TYPOGRAPHY_FIELDS,
  useCV,
} from '@/lib/cv-context'
import type { Typography } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function Stepper({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  display: string
  min: number
  max: number
  step: number
  onChange: (next: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm text-foreground">{label}</span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(value - step)}
          disabled={value <= min}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <Minus className="size-3.5" />
        </button>

        <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">
          {display}
        </span>

        <button
          type="button"
          onClick={() => onChange(value + step)}
          disabled={value >= max}
          aria-label={`Increase ${label.toLowerCase()}`}
          className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

export function TypographyDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { typography, setTypography, resetTypography } = useCV()

  const isDefault = (Object.keys(TYPOGRAPHY_DEFAULT) as (keyof Typography)[]).every(
    (key) => typography[key] === TYPOGRAPHY_DEFAULT[key],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Text size</DialogTitle>
          <DialogDescription>
            Each control sizes one part of the CV. Percentages are relative to the
            template&apos;s own sizing, so the layout stays balanced.
          </DialogDescription>
        </DialogHeader>

        <div className="divide-y divide-border">
          {TYPOGRAPHY_FIELDS.map(({ key, label }) => (
            <Stepper
              key={key}
              label={label}
              value={typography[key]}
              display={`${Math.round(typography[key] * 100)}%`}
              min={SCALE_RANGE.min}
              max={SCALE_RANGE.max}
              step={SCALE_RANGE.step}
              onChange={(next) => setTypography({ [key]: next })}
            />
          ))}

          <Stepper
            label="Line spacing"
            value={typography.lineHeight}
            display={typography.lineHeight.toFixed(2)}
            min={LINE_HEIGHT_RANGE.min}
            max={LINE_HEIGHT_RANGE.max}
            step={LINE_HEIGHT_RANGE.step}
            onChange={(next) => setTypography({ lineHeight: next })}
          />
        </div>

        <div className="mt-2 flex justify-end">
          <Button variant="ghost" size="sm" onClick={resetTypography} disabled={isDefault}>
            <RotateCcw />
            Reset to template defaults
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
