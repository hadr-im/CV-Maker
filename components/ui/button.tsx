import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2',
    'rounded-md border border-transparent text-sm font-medium whitespace-nowrap',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-150 outline-none select-none',
    'focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:ring-offset-0',
    'active:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-brand-blue text-brand-blue-foreground shadow-soft-sm hover:bg-brand-blue-soft hover:shadow-soft-md',
        accent:
          'bg-accent text-accent-foreground shadow-soft-sm hover:bg-brand-teal-soft hover:shadow-soft-md',
        ai: 'bg-highlight text-highlight-foreground shadow-soft-sm hover:bg-brand-amber-soft hover:shadow-soft-md',
        outline:
          'border-border bg-card text-foreground shadow-soft-xs hover:border-border-strong hover:bg-muted',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-muted',
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
        destructive:
          'text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/30',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-3.5',
        xs: "h-7 gap-1.5 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-2.5 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-11 rounded-lg px-5 text-[0.9rem]',
        xl: 'h-12 rounded-lg px-6 text-[0.95rem]',
        icon: 'size-9',
        'icon-xs': "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        'icon-sm': "size-8 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        'icon-lg': 'size-11 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
