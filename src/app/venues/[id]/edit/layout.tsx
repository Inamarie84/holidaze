// app/venues/[id]/edit/layout.tsx
import type { ReactNode } from 'react'
import type { Metadata } from 'next'

// IMPORTANT: set a *short* title here and let the root template add "• Holidaze"
// to avoid "Edit venue • Holidaze • Holidaze"
export const metadata: Metadata = {
  title: 'Edit venue',
  description: 'Update your venue details',
}

export default function EditLayout({ children }: { children: ReactNode }) {
  // This server layout ensures the head is committed *before* any client bailout
  return <>{children}</>
}
