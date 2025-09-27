// app/venues/[id]/edit/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  // absolute prevents root template duplication, keeps title stable in initial <head>
  title: { absolute: 'Edit venue • Holidaze' },
  description: 'Update your venue details',
}

export default function EditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // server component wrapper (no "use client")
  // keeps this segment fully SSR so <head> is sent up front
  return <>{children}</>
}
