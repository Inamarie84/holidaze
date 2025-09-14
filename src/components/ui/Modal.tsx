// src/components/ui/Modal.tsx
'use client'

import { useEffect } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* ⬇️ Add the explicit text color so content is dark on white */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl text-[var(--color-foreground)]">
        {title ? (
          <h2 id="modal-title" className="h3 mb-3">
            {title}
          </h2>
        ) : null}
        {children}
        <button
          onClick={onClose}
          className="mt-4 inline-flex rounded-lg border border-black/10 px-3 py-2 hover:bg-sand"
        >
          Close
        </button>
      </div>
    </div>
  )
}
