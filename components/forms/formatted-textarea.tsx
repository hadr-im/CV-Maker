'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'
import { EditorContent, useEditor, useEditorState, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List } from 'lucide-react'

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

type Run = { text: string; bold: boolean; italic: boolean }

/** One line of `**bold**` / `*italic*` / `***both***` markdown-lite, split into runs. */
const INLINE_MARKS = /(\*\*\*[^*\n]+\*\*\*|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g

function lineToRuns(line: string): Run[] {
  return line
    .split(INLINE_MARKS)
    .filter((part) => part.length > 0)
    .map((part) => {
      if (part.startsWith('***') && part.endsWith('***') && part.length > 6) {
        return { text: part.slice(3, -3), bold: true, italic: true }
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return { text: part.slice(2, -2), bold: true, italic: false }
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return { text: part.slice(1, -1), bold: false, italic: true }
      }
      return { text: part, bold: false, italic: false }
    })
}

function runsToParagraph(line: string): JSONContent {
  const runs = lineToRuns(line).filter((run) => run.text.length > 0)
  if (runs.length === 0) return { type: 'paragraph' }
  return {
    type: 'paragraph',
    content: runs.map((run) => ({
      type: 'text',
      text: run.text,
      marks: [...(run.bold ? [{ type: 'bold' }] : []), ...(run.italic ? [{ type: 'italic' }] : [])],
    })),
  }
}

/**
 * markdown-lite -> the Tiptap document. Two or more lines become a real bullet
 * list — matching how `EntryDescription` already renders the exported CV, so
 * what the user sees while editing matches the preview.
 */
function markdownToDoc(markdown: string): JSONContent {
  const lines = markdown.split('\n')
  if (lines.length <= 1) {
    return { type: 'doc', content: [runsToParagraph(lines[0] ?? '')] }
  }
  return {
    type: 'doc',
    content: [
      {
        type: 'bulletList',
        content: lines.map((line) => ({ type: 'listItem', content: [runsToParagraph(line)] })),
      },
    ],
  }
}

/** One text run back to `**bold**` / `*italic*` / `***both***`. */
function runToMarkdown(text: string, bold: boolean, italic: boolean) {
  if (!text.trim()) return text
  // Whitespace sits outside the marks, or "**bold **more" reads as sloppy in the export.
  const leading = text.slice(0, text.length - text.trimStart().length)
  const trailing = text.slice(text.trimEnd().length)
  const core = text.trim()
  const open = (bold ? '**' : '') + (italic ? '*' : '')
  const close = (italic ? '*' : '') + (bold ? '**' : '')
  return leading + open + core + close + trailing
}

function paragraphToLine(node: JSONContent | undefined): string {
  if (!node?.content) return ''
  return node.content
    .map((child) => {
      if (child.type !== 'text') return ''
      const marks = child.marks ?? []
      const bold = marks.some((mark) => mark.type === 'bold')
      const italic = marks.some((mark) => mark.type === 'italic')
      return runToMarkdown(child.text ?? '', bold, italic)
    })
    .join('')
}

/** The Tiptap document -> the markdown-lite string the rest of the app stores. */
function docToMarkdown(doc: JSONContent): string {
  const lines: string[] = []
  for (const node of doc.content ?? []) {
    if (node.type === 'paragraph') {
      lines.push(paragraphToLine(node))
    } else if (node.type === 'bulletList') {
      for (const item of node.content ?? []) {
        lines.push(paragraphToLine(item.content?.find((child) => child.type === 'paragraph')))
      }
    }
  }
  return lines.join('\n')
}

/**
 * Editor with bold, italic and a real bullet list — a Tiptap (ProseMirror)
 * surface rather than a hand-rolled contentEditable, so Enter/Backspace/lists
 * behave the way they do in any other rich text editor. What gets stored is
 * still the same markdown-lite string as before — nothing about the saved CV,
 * the templates, or localStorage changes.
 */
export function FormattedTextarea({
  id,
  value,
  onValueChange,
  placeholder,
  className,
  toolbarExtra,
}: Props) {
  // The last value we ourselves emitted. Rebuilding the document from a value
  // the user just typed would collapse their caret, so it's only rebuilt when
  // the change came from outside (e.g. the AI enhance modal replacing the text).
  const lastEmitted = useRef<string | null>(null)
  // onValueChange is a fresh closure every render; the editor instance is not.
  // Reading it through a ref keeps onUpdate from calling a stale callback.
  const onValueChangeRef = useRef(onValueChange)
  useEffect(() => {
    onValueChangeRef.current = onValueChange
  }, [onValueChange])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        code: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        link: false,
        strike: false,
        underline: false,
        orderedList: false,
        bulletList: { HTMLAttributes: { class: 'list-disc space-y-0.5 pl-[1.1em]' } },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: markdownToDoc(value),
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        role: 'textbox',
        'aria-multiline': 'true',
        class: cn(
          'rich-input min-h-24 w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm leading-relaxed text-foreground',
          'shadow-soft-xs transition-[color,box-shadow,border-color] duration-150 scrollbar-slim',
          'hover:border-border-strong focus:outline-none',
          'focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/25',
          className,
        ),
      },
      // A CV bullet is one line, not an outline — Tab/Shift-Tab would otherwise
      // nest lists, which the export (one bullet per line) can't represent.
      handleKeyDown: (_view, event) => event.key === 'Tab',
    },
    onUpdate: ({ editor: instance }) => {
      const markdown = docToMarkdown(instance.getJSON())
      lastEmitted.current = markdown
      onValueChangeRef.current(markdown)
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (!editor) return
    if (value === lastEmitted.current) return
    lastEmitted.current = value
    editor.commands.setContent(markdownToDoc(value), { emitUpdate: false })
  }, [editor, value])

  const active = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      bold: instance?.isActive('bold') ?? false,
      italic: instance?.isActive('italic') ?? false,
      bulletList: instance?.isActive('bulletList') ?? false,
    }),
  })

  const marks = [
    {
      command: 'bold' as const,
      label: 'Bold',
      hint: 'Bold (Ctrl+B)',
      Icon: Bold,
      isActive: active?.bold ?? false,
      run: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      command: 'italic' as const,
      label: 'Italic',
      hint: 'Italic (Ctrl+I)',
      Icon: Italic,
      isActive: active?.italic ?? false,
      run: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      command: 'bulletList' as const,
      label: 'Bulleted list',
      hint: 'Bulleted list (Ctrl+Shift+8)',
      Icon: List,
      isActive: active?.bulletList ?? false,
      run: () => editor?.chain().focus().toggleBulletList().run(),
    },
  ]

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-0.5">
          {marks.map(({ command, label, hint, Icon, isActive, run }) => (
            <button
              key={command}
              type="button"
              // Keeps the selection alive — mousedown would blur the surface.
              onMouseDown={(event) => event.preventDefault()}
              onClick={run}
              aria-label={label}
              aria-pressed={isActive}
              title={hint}
              className={cn(
                'grid size-7 place-items-center rounded-sm transition-colors',
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
        {toolbarExtra}
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
