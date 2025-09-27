'use client'

import { useEffect } from 'react'

export default function TitleSync({ title }: { title: string }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = title
    }
  }, [title])

  return null
}
