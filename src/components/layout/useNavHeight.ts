// src/components/layout/useNavHeight.tsx
'use client'
import { useCallback, useEffect, useRef } from 'react'

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
      // detach old
      roRef.current?.disconnect()
      elRef.current = node
      if (!node) return
      // attach new
      const ro = new ResizeObserver(setVar)
      ro.observe(node)
      roRef.current = ro
      setVar()
    },
    [setVar]
  )

  useEffect(() => () => roRef.current?.disconnect(), [])

  return ref
}
