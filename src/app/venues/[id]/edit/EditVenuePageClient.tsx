// src/app/venues/[id]/edit/EditVenuePageClient.tsx  (CLIENT)
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import VenueForm from '@/components/venue/VenueForm'
import type { VenueFormValues } from '@/types/forms'
import { getVenueById, updateVenue, deleteVenue } from '@/services/venues'
import { useSession } from '@/store/session'
import { errMsg } from '@/utils/errors'
import type { TVenueWithBookings } from '@/types/api'
import VenueDetailSkeleton from '@/components/venue/VenueDetailSkeleton'

type VenueWithOwner = TVenueWithBookings & { owner?: { name?: string } }

export default function EditVenuePageClient({
  id,
  initialVenue,
}: {
  id: string
  initialVenue?: VenueWithOwner | null
}) {
  const router = useRouter()
  const { token, user, hasHydrated } = useSession()

  const isAuthed = !!token
  const isManager = !!user?.venueManager

  const [venue, setVenue] = useState<VenueWithOwner | null>(
    (initialVenue as VenueWithOwner | null) ?? null
  )
  const [loading, setLoading] = useState(!initialVenue) // if we have initial, skip first skeleton
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const mounted = useRef(true)
  useEffect(
    () => () => {
      mounted.current = false
    },
    []
  )

  // Fetch the venue immediately (independent of auth) — avoids hydration race
  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setLoadError(null)
        if (!venue) setLoading(true)
        const v = (await getVenueById(
          id,
          { _owner: true },
          { signal: ac.signal }
        )) as VenueWithOwner
        if (!mounted.current || ac.signal.aborted) return
        setVenue(v)
      } catch (err) {
        if (!mounted.current || ac.signal.aborted) return
        setLoadError(errMsg(err))
      } finally {
        if (mounted.current && !ac.signal.aborted) setLoading(false)
      }
    })()
    return () => ac.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]) // don't include `venue` here; we only want to run on ID changes

  // Permission checks — only after hydration knows who you are
  useEffect(() => {
    if (!hasHydrated) return
    if (!isAuthed) {
      toast.error('Please log in.')
      router.replace('/login?role=manager')
      return
    }
    if (!isManager) {
      toast.error('Only venue managers can edit venues.')
      router.replace('/profile')
    }
  }, [hasHydrated, isAuthed, isManager, router])

  const isOwner = useMemo(() => {
    if (!venue || !user?.name) return false
    return venue.owner?.name === user.name
  }, [venue, user?.name])

  async function handleSubmit(values: VenueFormValues) {
    if (!venue || submitting) return
    try {
      setSubmitting(true)
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

      await updateVenue(venue.id, payload)
      toast.success('Venue updated!')
      router.push('/profile')
    } catch (err) {
      toast.error(errMsg(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!venue) return
    if (!confirm('Delete this venue? This cannot be undone.')) return
    try {
      setDeleting(true)
      await deleteVenue(venue.id)
      toast.success('Venue deleted')
      router.push('/profile')
    } catch (err) {
      toast.error(errMsg(err))
    } finally {
      setDeleting(false)
    }
  }

  // ===== Render states =====
  if (loading) return <VenueDetailSkeleton />

  if (loadError || !venue) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="body text-red-600">{loadError ?? 'Venue not found'}</p>
      </section>
    )
  }

  if (!isOwner) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="body text-red-600">
          You’re not allowed to edit this venue.
        </p>
      </section>
    )
  }

  const initialValues: VenueFormValues = {
    name: venue.name ?? '',
    description: venue.description ?? '',
    price: typeof venue.price === 'number' ? venue.price : '',
    maxGuests: typeof venue.maxGuests === 'number' ? venue.maxGuests : '',
    media:
      (venue.media ?? []).map((m) => ({
        id: crypto.randomUUID(),
        url: m?.url ?? '',
        alt: m?.alt ?? '',
      })) || [],
    meta: {
      wifi: !!venue.meta?.wifi,
      parking: !!venue.meta?.parking,
      breakfast: !!venue.meta?.breakfast,
      pets: !!venue.meta?.pets,
    },
    location: {
      address: venue.location?.address ?? '',
      city: venue.location?.city ?? '',
      zip: venue.location?.zip ?? '',
      country: venue.location?.country ?? '',
    },
  }

  return (
    <section key={id} className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="h1">Edit Venue</h1>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
      <p className="muted mb-8">Update your venue details below.</p>

      <VenueForm
        mode="edit"
        initialValues={initialValues}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        onDelete={handleDelete}
      />
    </section>
  )
}
