// src/components/ui/ToastHost.tsx
'use client'

import dynamic from 'next/dynamic'

// Load Toaster only on the client to avoid TS/SSR complaints
const Toaster = dynamic(
  () => import('react-hot-toast').then((m) => m.Toaster),
  { ssr: false }
)

export default function ToastHost() {
  return <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
}
