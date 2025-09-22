'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import VenueForm from '@/components/venue/VenueForm'
import type { VenueFormValues } from '@/types/forms'
import { createVenue } from '@/services/venues'
import { useSession } from '@/store/session'
import { errMsg } from '@/utils/errors'

export default function CreateVenuePage() {
  const router = useRouter()
  const { token, user } = useSession()

  const isAuthed = !!token
  const isManager = !!user?.venueManager
  const canRender = useMemo(() => isAuthed && isManager, [isAuthed, isManager])

  useEffect(() => {
    if (!isAuthed) {
      toast.error('Please log in to create a venue.')
      router.push('/login?role=manager')
    } else if (!isManager) {
      toast.error('Only venue managers can create venues.')
      router.push('/profile')
    }
  }, [isAuthed, isManager, router])

  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(values: VenueFormValues) {
    if (submitting) return
    const priceNum =
      typeof values.price === 'string' ? Number(values.price) : values.price
    const guestsNum =
      typeof values.maxGuests === 'string'
        ? Number(values.maxGuests)
        : values.maxGuests

    const payload = {
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      price: priceNum as number,
      maxGuests: guestsNum as number,
      media:
        values.media
          .map(({ url, alt }) => ({
            url: url.trim(),
            alt: alt.trim() || undefined,
          }))
          .filter((m) => m.url) || undefined,
      meta: { ...values.meta },
      location: { ...values.location },
    }

    try {
      setSubmitting(true)
      await createVenue(payload)
      toast.success('Venue created!')
      router.push('/profile')
    } catch (err) {
      toast.error(errMsg(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (!canRender) {
    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="body muted">Checking permissions…</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="h1 mb-2">Create Venue</h1>
      <p className="muted mb-8">
        Fill out the details below to publish a new venue.
      </p>

      <VenueForm
        mode="create"
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </main>
  )
}
