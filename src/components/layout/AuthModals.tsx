'use client'

import Link from 'next/link'
import Modal from '@/components/ui/Modal'

type ModalProps = {
  open: boolean
  onClose: () => void
}

export function RegisterModal({ open, onClose }: ModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Create account">
      <p className="body mb-4">Choose the type of account to create:</p>
      <div className="grid gap-2">
        <Link
          prefetch={false}
          href="/register?role=customer"
          onClick={onClose}
          className="inline-flex w-full items-center justify-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90"
        >
          I’m a Customer
        </Link>
        <Link
          prefetch={false}
          href="/register?role=manager"
          onClick={onClose}
          className="inline-flex w-full items-center justify-center rounded-lg border border-black/10 px-4 py-2 hover:bg-sand text-brand"
        >
          I’m a Venue Manager
        </Link>
      </div>
      <p className="muted mt-3">
        Note: Use your <b>@stud.noroff.no</b> email.
      </p>
    </Modal>
  )
}

export function LoginModal({ open, onClose }: ModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Log in">
      <p className="body mb-4">Log in to your account:</p>
      <div className="grid gap-2">
        <Link
          prefetch={false}
          href="/login?role=customer"
          onClick={onClose}
          className="inline-flex w-full items-center justify-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90"
        >
          Customer login
        </Link>
        <Link
          prefetch={false}
          href="/login?role=manager"
          onClick={onClose}
          className="inline-flex w-full items-center justify-center rounded-lg border border-black/10 px-4 py-2 hover:bg-sand text-brand"
        >
          Venue Manager login
        </Link>
      </div>
      <p className="muted mt-3">
        Don’t have an account? Choose Register instead.
      </p>
    </Modal>
  )
}
