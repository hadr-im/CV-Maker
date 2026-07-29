'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { Group, Panel, Separator } from 'react-resizable-panels'

import { BuilderHeader } from '@/components/builder/builder-header'
import { Drawer } from '@/components/builder/drawer'
import { EditorPanel } from '@/components/builder/editor-panel'
import { PreviewPanel } from '@/components/builder/preview-panel'
import { SectionsNav } from '@/components/builder/sections-nav'
import { TemplatesNav } from '@/components/builder/templates-nav'
import { useIsDesktop } from '@/lib/use-media-query'
import { cn } from '@/lib/utils'

export function BuilderShell() {
  const { matches: isDesktop, mounted } = useIsDesktop()
  const [sectionsOpen, setSectionsOpen] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [railCollapsed, setRailCollapsed] = useState(false)
  const [templatesCollapsed, setTemplatesCollapsed] = useState(false)
  const [editorCollapsed, setEditorCollapsed] = useState(false)

  // The builder owns the viewport on desktop; marketing pages must keep scrolling.
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('app-locked')
    return () => root.classList.remove('app-locked')
  }, [])

  // Drawers are a small-screen affordance only.
  useEffect(() => {
    if (isDesktop) {
      setSectionsOpen(false)
      setTemplatesOpen(false)
      // The split view already shows both panels, so a collapsed form would
      // just be a dead half of the screen.
      setEditorCollapsed(false)
    }
  }, [isDesktop])

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      <BuilderHeader
        onOpenSections={() => setSectionsOpen(true)}
        onOpenTemplates={() => setTemplatesOpen(true)}
      />

      <div className="flex min-h-0 flex-1">
        {/* -------------------------------------------------- Sections rail */}
        <aside
          className={cn(
            'hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 lg:flex',
            railCollapsed ? 'w-[4.5rem]' : 'w-60',
          )}
        >
          <div
            className={cn(
              'flex h-12 shrink-0 items-center border-b border-sidebar-border',
              railCollapsed ? 'justify-center px-2' : 'justify-between px-4',
            )}
          >
            {!railCollapsed && (
              <span className="text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
                Sections
              </span>
            )}
            <button
              type="button"
              onClick={() => setRailCollapsed((value) => !value)}
              aria-label={railCollapsed ? 'Expand sections' : 'Collapse sections'}
              title={railCollapsed ? 'Expand' : 'Collapse'}
              className="grid size-7 place-items-center rounded-md text-subtle-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {railCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-slim">
            <SectionsNav collapsed={railCollapsed} />
          </div>

          <div
            className={cn(
              'shrink-0 border-t border-sidebar-border p-3',
              railCollapsed && 'flex justify-center px-2',
            )}
          >
            <Link
              href="/"
              title="Back to home"
              className={cn(
                'flex items-center rounded-lg text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                railCollapsed ? 'size-10 justify-center' : 'gap-3 px-3 py-2.5',
              )}
            >
              <Home className="size-4 shrink-0" />
              {!railCollapsed && <span>Back to home</span>}
            </Link>
          </div>
        </aside>

        {/* ------------------------------------------------ Editor + preview */}
        <main className="min-w-0 flex-1">
          {mounted && isDesktop ? (
            <Group orientation="horizontal" className="h-full">
              <Panel id="editor" defaultSize="50" minSize="30">
                <EditorPanel />
              </Panel>

              <Separator
                className={cn(
                  'group relative w-px shrink-0 bg-border outline-none',
                  'after:absolute after:inset-y-0 after:-left-1.5 after:-right-1.5 after:content-[""]',
                  'hover:bg-accent data-[dragging]:bg-accent',
                  'transition-colors duration-150',
                )}
              />

              <Panel id="preview" defaultSize="50" minSize="30">
                <PreviewPanel />
              </Panel>
            </Group>
          ) : (
            // Small screens: form first, preview stacked underneath. Collapsing
            // the form drops it to its header, so the preview comes up the page
            // instead of having to be scrolled to.
            <div className="h-full overflow-y-auto scrollbar-slim">
              <div className={cn(!editorCollapsed && 'min-h-[70svh]')}>
                <EditorPanel
                  collapsed={editorCollapsed}
                  onToggleCollapsed={() => setEditorCollapsed((value) => !value)}
                />
              </div>
              <div className="min-h-[80svh] border-t-8 border-muted">
                <PreviewPanel />
              </div>
            </div>
          )}
        </main>

        {/* ------------------------------------------------- Templates rail */}
        <aside
          className={cn(
            'hidden shrink-0 flex-col border-l border-sidebar-border bg-sidebar transition-[width] duration-300 lg:flex',
            templatesCollapsed ? 'w-[4.5rem]' : 'w-72',
          )}
        >
          <div
            className={cn(
              'flex h-12 shrink-0 items-center border-b border-sidebar-border',
              templatesCollapsed ? 'justify-center px-2' : 'justify-between px-4',
            )}
          >
            <button
              type="button"
              onClick={() => setTemplatesCollapsed((value) => !value)}
              aria-label={templatesCollapsed ? 'Expand templates' : 'Collapse templates'}
              title={templatesCollapsed ? 'Expand' : 'Collapse'}
              className="grid size-7 place-items-center rounded-md text-subtle-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {templatesCollapsed ? (
                <ChevronLeft className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
            {!templatesCollapsed && (
              <span className="text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
                Templates
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-slim">
            <TemplatesNav collapsed={templatesCollapsed} />
          </div>
        </aside>
      </div>

      {/* ------------------------------------------------------- Mobile drawers */}
      <Drawer open={sectionsOpen} onClose={() => setSectionsOpen(false)} side="left" title="Sections">
        <SectionsNav onNavigate={() => setSectionsOpen(false)} />
        <div className="border-t border-sidebar-border p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Home className="size-4" />
            Back to home
          </Link>
        </div>
      </Drawer>

      <Drawer
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        side="right"
        title="Templates"
      >
        <TemplatesNav onSelect={() => setTemplatesOpen(false)} />
      </Drawer>
    </div>
  )
}
