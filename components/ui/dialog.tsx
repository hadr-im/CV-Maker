'use client'

import * as React from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

const DialogCloseContext = React.createContext<() => void>(() => {})

const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}) => {
  const close = React.useCallback(() => onOpenChange(false), [onOpenChange])

  React.useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  if (!open) return null

  return (
    <DialogCloseContext.Provider value={close}>
      <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
        <div
          className="absolute inset-0 bg-[#0e0e10]/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={close}
        />
        {children}
      </div>
    </DialogCloseContext.Provider>
  )
}

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { showClose?: boolean }
>(({ className, children, showClose = true, ...props }, ref) => {
  const close = React.useContext(DialogCloseContext)

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      className={cn(
        'relative z-10 flex max-h-[92svh] w-full max-w-lg flex-col overflow-y-auto scrollbar-slim',
        'rounded-t-2xl border border-border bg-popover p-5 text-popover-foreground shadow-soft-lg sm:rounded-2xl sm:p-6',
        'animate-in fade-in slide-in-from-bottom-4 duration-200 sm:zoom-in-95 sm:slide-in-from-bottom-0',
        className,
      )}
      {...props}
    >
      {showClose && (
        <button
          type="button"
          onClick={close}
          aria-label="Close dialog"
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
      {children}
    </div>
  )
})
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-5 flex flex-col gap-1.5 pr-8', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-base font-semibold leading-tight tracking-tight text-foreground', className)}
      {...props}
    />
  ),
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm leading-relaxed text-muted-foreground', className)} {...props} />
))
DialogDescription.displayName = 'DialogDescription'

export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
