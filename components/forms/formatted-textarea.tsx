'use client'

import * as React from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { Bold, Italic } from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
  id?: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  /** Rendered to the right of the toolbar — the "Enhance with AI" button, etc. */
  toolbarExtra?: React.ReactNode
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** `**bold**` / `*italic*` → the HTML the editable surface displays. */
function markdownToHtml(markdown: string) {
  return escapeHtml(markdown)
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .split('\n')
    .join('<br>')
}

/**
 * The editable surface back to markdown.
 *
 * Collected as runs rather than emitted inline, so that two adjacent bold nodes
 * — which is what a browser leaves behind after enough editing — come out as
 * one `**pair**` instead of `**pair****ed**`.
 */
function htmlToMarkdown(root: HTMLElement) {
  const runs: { text: string; bold: boolean; italic: boolean }[] = []

  const walk = (node: Node, bold: boolean, italic: boolean) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? ''
        if (text) runs.push({ text, bold, italic })
        return
      }
      if (!(child instanceof HTMLElement)) return

      const tag = child.tagName
      if (tag === 'BR') {
        runs.push({ text: '\n', bold: false, italic: false })
        return
      }
      // A browser wraps new lines in DIV or P; both mean "line break".
      if ((tag === 'DIV' || tag === 'P') && runs.length > 0) {
        runs.push({ text: '\n', bold: false, italic: false })
      }
      walk(
        child,
        bold || tag === 'B' || tag === 'STRONG',
        italic || tag === 'I' || tag === 'EM',
      )
    })
  }

  walk(root, false, false)

  let out = ''
  for (let i = 0; i < runs.length; i += 1) {
    const run = runs[i]
    if (run.text === '\n') {
      out += '\n'
      continue
    }
    // Merge with everything that follows carrying the same marks.
    let text = run.text
    while (
      i + 1 < runs.length &&
      runs[i + 1].text !== '\n' &&
      runs[i + 1].bold === run.bold &&
      runs[i + 1].italic === run.italic
    ) {
      text += runs[i + 1].text
      i += 1
    }
    if (!text.trim()) {
      out += text
      continue
    }

    // Whitespace has to sit outside the marks. "**bold **more" is a mark
    // wrapping a trailing space, which reads as sloppy in the export and is not
    // what any markdown reader expects.
    const leading = text.slice(0, text.length - text.trimStart().length)
    const trailing = text.slice(text.trimEnd().length)
    const core = text.trim()

    const open = (run.bold ? '**' : '') + (run.italic ? '*' : '')
    const close = (run.italic ? '*' : '') + (run.bold ? '**' : '')
    out += leading + open + core + close + trailing
  }

  return out
}

/**
 * Editor with bold and italic that shows the formatting rather than its syntax.
 *
 * It is a contentEditable surface, not a textarea: a textarea can only ever
 * display plain characters, so the marks would stay visible as `**this**`. What
 * gets stored is still the same markdown-lite string as before — nothing about
 * the saved CV, the templates, or localStorage changes.
 */
export function FormattedTextarea({
  id,
  value,
  onValueChange,
  placeholder,
  className,
  toolbarExtra,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  // The last value we ourselves emitted. Re-rendering the DOM from a value the
  // user just typed would collapse their caret to the start on every keystroke,
  // so the surface is only rewritten when the change came from outside.
  const lastEmitted = useRef<string | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (value === lastEmitted.current) return
    el.innerHTML = markdownToHtml(value)
    lastEmitted.current = value
  }, [value])

  const emit = useCallback(() => {
    const el = ref.current
    if (!el) return
    const markdown = htmlToMarkdown(el)
    lastEmitted.current = markdown
    onValueChange(markdown)
  }, [onValueChange])

  const applyMark = (command: 'bold' | 'italic') => {
    ref.current?.focus()
    // execCommand is deprecated but remains the only cross-browser way to
    // toggle inline formatting over a selection without hand-rolling a range
    // splitter. Every current browser still implements these two.
    document.execCommand(command)
    emit()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return
    const key = event.key.toLowerCase()
    if (key !== 'b' && key !== 'i') return
    event.preventDefault()
    applyMark(key === 'b' ? 'bold' : 'italic')
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-0.5">
          {[
            { command: 'bold' as const, label: 'Bold', hint: 'Bold (Ctrl+B)', Icon: Bold },
            { command: 'italic' as const, label: 'Italic', hint: 'Italic (Ctrl+I)', Icon: Italic },
          ].map(({ command, label, hint, Icon }) => (
            <button
              key={command}
              type="button"
              // Keeps the selection alive — mousedown would blur the surface.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyMark(command)}
              aria-label={label}
              title={hint}
              className="grid size-7 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
        {toolbarExtra}
      </div>

      <div
        id={id}
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        onKeyDown={handleKeyDown}
        className={cn(
          'rich-input flex min-h-24 w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm leading-relaxed text-foreground',
          'shadow-soft-xs transition-[color,box-shadow,border-color] duration-150 scrollbar-slim',
          'hover:border-border-strong',
          'focus-visible:border-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/25',
          className,
        )}
      />
    </div>
  )
}
