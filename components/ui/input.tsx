import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground',
        'shadow-soft-xs transition-[color,box-shadow,border-color] duration-150',
        'placeholder:text-subtle-foreground',
        'hover:border-border-strong',
        'focus-visible:border-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/25',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export { Input }
