'use client'

import { useEffect, useRef } from 'react'
import type { TMedia } from '@/types/api'

type Props = {
  images: TMedia[] // pass empty [] if none; we’ll fall back to placeholder
  venueName: string // for accessible alt/figcaption fallback
  activeIndex: number
  onChange: (index: number) => void
  className?: string
}

/**
 * Accessible, semantic gallery:
 * - <figure> + <figcaption>
 * - Keyboard: arrow keys to move focus/selection on the thumbnail row
 * - Uses a safe placeholder when no images exist
 * - No Next/Image on purpose (external URLs from API), to avoid domain config snags
 */
export default function Gallery({
  images,
  venueName,
  activeIndex,
  onChange,
  className,
}: Props) {
  const safeImages = images?.length
    ? images.filter((m) => !!m?.url)
    : [{ url: '/images/placeholder.jpg', alt: venueName }]

  const listRef = useRef<HTMLDivElement>(null)

  // Keep the active thumb in view on change
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const btn = list.querySelector<HTMLButtonElement>(
      `[data-idx="${activeIndex}"]`
    )
    if (btn) {
      const { left, right } = btn.getBoundingClientRect()
      const { left: L, right: R } = list.getBoundingClientRect()
      if (left < L || right > R)
        btn.scrollIntoView({ inline: 'center', block: 'nearest' })
    }
  }, [activeIndex])

  function onKeyDownThumbs(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const last = safeImages.length - 1
    let next = activeIndex
    if (e.key === 'ArrowLeft') next = Math.max(0, activeIndex - 1)
    if (e.key === 'ArrowRight') next = Math.min(last, activeIndex + 1)
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = last
    onChange(next)
  }

  const main = safeImages[activeIndex] ?? safeImages[0]

  return (
    <figure className={className}>
      {/* Main image */}
      <div className="mb-3 overflow-hidden rounded-xl border border-black/10 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={main.url}
          alt={main.alt || venueName}
          className="aspect-[16/9] w-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <>
          <figcaption className="sr-only">
            Image gallery for {venueName}
          </figcaption>
          <div
            ref={listRef}
            role="listbox"
            aria-label="Venue images"
            aria-activedescendant={`thumb-${activeIndex}`}
            tabIndex={0}
            onKeyDown={onKeyDownThumbs}
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {safeImages.map((img, i) => {
              const isActive = i === activeIndex
              return (
                <button
                  key={img.url + i}
                  id={`thumb-${i}`}
                  data-idx={i}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => onChange(i)}
                  className={[
                    'relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border',
                    isActive
                      ? 'border-emerald ring-2 ring-emerald/40'
                      : 'border-black/10',
                    'hover:opacity-90 focus:outline-none',
                  ].join(' ')}
                  title={img.alt || `Image ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt || venueName}
                    className="h-full w-full object-cover"
                  />
                </button>
              )
            })}
          </div>
        </>
      )}
    </figure>
  )
}
