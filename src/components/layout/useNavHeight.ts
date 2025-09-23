'use client'
import { useEffect } from 'react'

export default function useNavHeight(
  headerRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    const setVar = () =>
      document.documentElement.style.setProperty(
        '--nav-height',
        `${el.offsetHeight}px`
      )

    setVar()

    const ro = new ResizeObserver(setVar)
    ro.observe(el)
    window.addEventListener('resize', setVar, { passive: true })

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', setVar)
    }
  }, [headerRef])
}
