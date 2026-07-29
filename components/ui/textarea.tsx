import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      'flex min-h-24 w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm leading-relaxed text-foreground',
      'shadow-soft-xs transition-[color,box-shadow,border-color] duration-150 scrollbar-slim',
      'placeholder:text-subtle-foreground',
      'hover:border-border-strong',
      'focus-visible:border-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/25',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border',
      className,
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }
