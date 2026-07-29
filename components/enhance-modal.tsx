'use client'

import { useState } from 'react'
import { AlertCircle, Check, Copy, RefreshCw, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface EnhanceModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  company: string
  description: string
  onSave: (bullets: string) => void
}

export function EnhanceModal({
  isOpen,
  onClose,
  title,
  company,
  description,
  onSave,
}: EnhanceModalProps) {
  const [loading, setLoading] = useState(false)
  const [bullets, setBullets] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setBullets([])

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, company, description }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error ?? 'The AI service did not respond. Try again in a moment.')
      }

      const data = await response.json()
      setBullets(data.bullets ?? [])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bullets.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-highlight/15">
              <Sparkles className="size-4 text-highlight" />
            </span>
            Rewrite as CV bullets
          </DialogTitle>
          <DialogDescription>
            Your notes become up to three tight bullet points. Nothing is invented — only what you
            wrote gets reworded.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-border bg-muted/40 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
              {title} · {company}
            </p>
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </section>

          {loading && (
            <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-3.5">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-4 animate-pulse rounded bg-muted"
                  style={{
                    width: `${[92, 78, 85][index]}%`,
                    animationDelay: `${index * 140}ms`,
                  }}
                />
              ))}
              <p className="mt-1 text-xs text-subtle-foreground">Rewriting your notes…</p>
            </div>
          )}

          {bullets.length > 0 && !loading && (
            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
                Suggested bullets
              </p>
              <ul className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3.5">
                {bullets.map((bullet, index) => (
                  <li key={index} className="text-sm leading-relaxed text-foreground">
                    {bullet}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/10 p-3.5">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-sm leading-relaxed text-destructive">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            {bullets.length === 0 ? (
              <>
                <Button onClick={handleGenerate} disabled={loading} className="flex-1">
                  <Sparkles />
                  {loading ? 'Generating…' : 'Generate bullets'}
                </Button>
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => onSave(bullets.join('\n'))} className="flex-1">
                  <Check />
                  Use these bullets
                </Button>
                <Button onClick={handleCopy} variant="outline">
                  {copied ? <Check /> : <Copy />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button onClick={handleGenerate} variant="outline" disabled={loading}>
                  <RefreshCw />
                  Retry
                </Button>
              </>
            )}
          </div>

          <p className="text-xs leading-relaxed text-subtle-foreground">
            Replacing your notes overwrites what you typed. Copy them first if you want to keep the
            original.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
