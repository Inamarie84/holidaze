'use client'

import dynamic from 'next/dynamic'

/**
 * React Hot Toast host; loaded client-only to avoid SSR/hydration inconsistencies.
 */
const Toaster = dynamic(
  () => import('react-hot-toast').then((m) => m.Toaster),
  {
    ssr: false,
  }
)

export default function ToastHost() {
  return <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
}
