'use client'

import { useCallback, useEffect, useRef } from 'react'

/**
 * Hook: returns a ref for the header element and writes its current
 * height to the CSS var `--nav-height`. Used for offsetting overlays.
 */
export default function useNavHeight() {
  const elRef = useRef<HTMLElement | null>(null)
  const roRef = useRef<ResizeObserver | null>(null)

  const setVar = useCallback(() => {
    const el = elRef.current
    if (!el) return
    document.documentElement.style.setProperty(
      '--nav-height',
      `${el.offsetHeight}px`
    )
  }, [])

  const ref = useCallback(
    (node: HTMLElement | null) => {
      roRef.current?.disconnect()
      elRef.current = node
      if (!node) return
      const ro = new ResizeObserver(setVar)
      ro.observe(node)
      roRef.current = ro
      setVar()
    },
    [setVar]
  )

  useEffect(() => {
    return () => roRef.current?.disconnect()
  }, [])

  return ref
}
