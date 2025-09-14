// src/components/ui/LoadMore.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function LoadMore({
  nextPage,
  label = 'Load more',
}: {
  nextPage: number
  label?: string
}) {
  const router = useRouter()
  const params = useSearchParams()

  function go() {
    const usp = new URLSearchParams(params.toString())
    usp.set('page', String(nextPage))
    router.push(`/venues?${usp.toString()}`)
  }

  return (
    <button
      onClick={go}
      className="mt-8 inline-flex items-center justify-center rounded-lg border border-black/15 px-4 py-2 hover:bg-sand"
    >
      {label}
    </button>
  )
}
