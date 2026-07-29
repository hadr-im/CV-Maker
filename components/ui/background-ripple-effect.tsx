'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Point = { x: number; y: number }

/**
 * Interactive grid backdrop: hover highlights a cell, clicking sends a ripple
 * outward from it.
 *
 * The grid is painted as a single repeating gradient rather than one element
 * per cell — a full-width hero is ~500 cells, and rendering those as real nodes
 * costs a click-time remount plus one animation each. Everything here is three
 * nodes and one GPU-composited transform.
 */
export const BackgroundRippleEffect = ({
  cellSize = 56,
  className,
  interactive = true,
}: {
  cellSize?: number
  className?: string
  interactive?: boolean
}) => {
  const [hover, setHover] = useState<Point | null>(null)
  const [ripple, setRipple] = useState<(Point & { key: number }) | null>(null)
  const frame = useRef<number>(0)
  const pending = useRef<Point | null>(null)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  // Snap to the cell under the pointer. offsetX/offsetY avoid a layout read,
  // and the rAF gate keeps this to at most one state update per frame.
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive) return
      const { offsetX, offsetY } = event.nativeEvent
      pending.current = {
        x: Math.floor(offsetX / cellSize) * cellSize,
        y: Math.floor(offsetY / cellSize) * cellSize,
      }
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        setHover(pending.current)
      })
    },
    [cellSize, interactive],
  )

  const handlePointerLeave = useCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    setHover(null)
  }, [])

  const handleClick = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive) return
      const { offsetX, offsetY } = event.nativeEvent
      setRipple({ x: offsetX, y: offsetY, key: Date.now() })
    },
    [interactive],
  )

  return (
    <div
      aria-hidden="true"
      onPointerMove={interactive ? handlePointerMove : undefined}
      onPointerLeave={interactive ? handlePointerLeave : undefined}
      onPointerDown={interactive ? handleClick : undefined}
      className={cn(
        'absolute inset-0 overflow-hidden',
        interactive ? 'cursor-crosshair' : 'pointer-events-none',
        className,
      )}
      style={{ contain: 'strict' }}
    >
      {/* Grid lines — one element, no per-cell nodes */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--cell-border) 1px, transparent 1px), linear-gradient(to bottom, var(--cell-border) 1px, transparent 1px)',
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />

      {/* Hovered cell — moved with a composited transform */}
      {hover && (
        <div
          className="pointer-events-none absolute left-0 top-0 transition-opacity duration-150"
          style={{
            width: cellSize,
            height: cellSize,
            transform: `translate3d(${hover.x}px, ${hover.y}px, 0)`,
            backgroundColor: 'var(--cell-hover)',
            willChange: 'transform',
          }}
        />
      )}

      {/* Ripple — one animated element, restarted by its key */}
      {ripple && (
        <div
          key={ripple.key}
          onAnimationEnd={() => setRipple(null)}
          className="animate-grid-ripple pointer-events-none absolute"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: cellSize * 24,
            height: cellSize * 24,
            marginLeft: cellSize * -12,
            marginTop: cellSize * -12,
            backgroundImage:
              'radial-gradient(circle, transparent 0%, transparent 38%, var(--cell-hover) 48%, transparent 62%)',
          }}
        />
      )}
    </div>
  )
}
