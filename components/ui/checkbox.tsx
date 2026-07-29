import * as React from 'react'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <span className="relative inline-flex shrink-0">
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          'peer size-4.5 shrink-0 cursor-pointer appearance-none rounded-[6px] border border-border-strong bg-input',
          'transition-colors duration-150',
          'hover:border-accent/60',
          'checked:border-accent checked:bg-accent',
          'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/25',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
      <Check
        aria-hidden="true"
        strokeWidth={3}
        className="pointer-events-none absolute inset-0 m-auto size-3 scale-50 text-accent-foreground opacity-0 transition-all duration-150 peer-checked:scale-100 peer-checked:opacity-100"
      />
    </span>
  ),
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
