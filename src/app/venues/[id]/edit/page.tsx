//src/app/venues/[id]/edit/page.tsx

'use client'

/**
 * Edit Venue page (owner-only).
 * - Loads venue by id (with _owner=true)
 * - Guards access: must be logged in, manager, and owner of this venue
 * - Prefills form; updates via updateVenue(); shows toast, redirects to /profile
 * - Optional: delete venue button
 */

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from '@/store/session'
import toast from 'react-hot-toast'

import {
  getVenueById,
  updateVenue,
  deleteVenue,
  type UpsertVenueInput,
} from '@/services/venues'
import { errMsg } from '@/utils/errors'
import FormError from '@/components/ui/FormError'
import type { TVenueWithBookings } from '@/types/api'

type MediaField = { id: string; url: string; alt: string }
type VenueOwner = { name?: string }
type VenueForEdit = TVenueWithBookings & { owner?: VenueOwner }

export default function EditVenuePage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { token, user } = useSession()

  const isAuthed = !!token
  const isManager = !!user?.venueManager

  const [venue, setVenue] = useState<VenueForEdit | null>(null)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // ---- Form State ----
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [maxGuests, setMaxGuests] = useState<number | ''>('')

  const [media, setMedia] = useState<MediaField[]>([
    { id: crypto.randomUUID(), url: '', alt: '' },
  ])

  const [meta, setMeta] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  })

  const [location, setLocation] = useState({
    address: '',
    city: '',
    zip: '',
    country: '',
    continent: '',
    lat: '' as number | '' | undefined,
    lng: '' as number | '' | undefined,
  })

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // ---- Load Venue ----
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoadingInitial(true)
        setLoadError(null)
        // ask for owner so we can verify ownership
        const v = (await getVenueById(id, { _owner: true })) as VenueForEdit
        if (!mounted) return
        setVenue(v)

        // Prefill form state
        setName(v.name ?? '')
        setDescription(v.description ?? '')
        setPrice(typeof v.price === 'number' ? v.price : '')
        setMaxGuests(typeof v.maxGuests === 'number' ? v.maxGuests : '')

        const mediaFields: MediaField[] = (v.media ?? []).map((m, idx) => ({
          id: crypto.randomUUID(),
          url: m?.url ?? '',
          alt: m?.alt ?? '',
        })) || [{ id: crypto.randomUUID(), url: '', alt: '' }]
        setMedia(
          mediaFields.length
            ? mediaFields
            : [{ id: crypto.randomUUID(), url: '', alt: '' }]
        )

        setMeta({
          wifi: !!v.meta?.wifi,
          parking: !!v.meta?.parking,
          breakfast: !!v.meta?.breakfast,
          pets: !!v.meta?.pets,
        })

        setLocation({
          address: v.location?.address ?? '',
          city: v.location?.city ?? '',
          zip: v.location?.zip ?? '',
          country: v.location?.country ?? '',
          continent: v.location?.continent ?? '',
          lat: (typeof v.location?.lat === 'number' ? v.location?.lat : '') as
            | number
            | ''
            | undefined,
          lng: (typeof v.location?.lng === 'number' ? v.location?.lng : '') as
            | number
            | ''
            | undefined,
        })
      } catch (err) {
        if (!mounted) return
        setLoadError(errMsg(err))
      } finally {
        mounted && setLoadingInitial(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [id])

  // ---- Ownership Guard ----
  const isOwner = useMemo(() => {
    if (!venue || !user?.name) return false
    return venue.owner?.name === user.name
  }, [venue, user?.name])

  useEffect(() => {
    if (!isAuthed) {
      toast.error('Please log in.')
      router.push('/login?role=manager')
      return
    }
    if (!isManager) {
      toast.error('Only venue managers can edit venues.')
      router.push('/profile')
      return
    }
  }, [isAuthed, isManager, router])

  // Only render after auth check and data load
  const canRender = isAuthed && isManager && !loadingInitial && !!venue

  // ---- Derived validation (inline, per field) ----
  const priceNum = typeof price === 'string' ? Number(price) : price
  const guestsNum =
    typeof maxGuests === 'string' ? Number(maxGuests) : maxGuests

  const nameError = !name.trim() ? 'Name is required.' : null
  const priceError =
    price === '' ||
    priceNum === undefined ||
    Number.isNaN(priceNum) ||
    priceNum <= 0
      ? 'Price must be a positive number.'
      : null
  const maxGuestsError =
    maxGuests === '' ||
    guestsNum === undefined ||
    Number.isNaN(guestsNum) ||
    guestsNum < 1
      ? 'Max guests must be at least 1.'
      : null

  const latNum =
    location.lat === '' || location.lat === undefined
      ? undefined
      : Number(location.lat)
  const lngNum =
    location.lng === '' || location.lng === undefined
      ? undefined
      : Number(location.lng)

  const latError =
    location.lat === '' || location.lat === undefined
      ? null
      : Number.isNaN(latNum)
        ? 'Latitude must be a number.'
        : latNum! < -90 || latNum! > 90
          ? 'Latitude must be between -90 and 90.'
          : null

  const lngError =
    location.lng === '' || location.lng === undefined
      ? null
      : Number.isNaN(lngNum)
        ? 'Longitude must be a number.'
        : lngNum! < -180 || lngNum! > 180
          ? 'Longitude must be between -180 and 180.'
          : null

  const hasBlockingErrors =
    !!nameError || !!priceError || !!maxGuestsError || !!latError || !!lngError

  // ---- Handlers ----
  function addMediaRow() {
    setMedia((m) => [...m, { id: crypto.randomUUID(), url: '', alt: '' }])
  }
  function removeMediaRow(id: string) {
    setMedia((m) => m.filter((x) => x.id !== id))
  }
  function updateMediaRow(id: string, field: 'url' | 'alt', value: string) {
    setMedia((m) => m.map((x) => (x.id === id ? { ...x, [field]: value } : x)))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    if (!venue) return
    if (!isOwner) {
      toast.error('Only the owner can edit this venue.')
      return
    }
    if (hasBlockingErrors) {
      toast.error('Please fix the errors before saving.')
      return
    }

    const mediaClean = media
      .map(({ url, alt }) => ({
        url: url.trim(),
        alt: alt.trim() || undefined,
      }))
      .filter((m) => m.url)

    const payload: UpsertVenueInput = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: priceNum as number,
      maxGuests: guestsNum as number,
      media: mediaClean.length ? mediaClean : undefined,
      meta: { ...meta },
      location: {
        address: location.address.trim() || undefined,
        city: location.city.trim() || undefined,
        zip: location.zip.trim() || undefined,
        country: location.country.trim() || undefined,
        continent: location.continent.trim() || undefined,
        lat: Number.isFinite(latNum!) ? latNum : undefined,
        lng: Number.isFinite(lngNum!) ? lngNum : undefined,
      },
    }

    try {
      setSaving(true)
      await updateVenue(venue.id, payload)
      toast.success('Venue updated!')
      router.push('/profile')
    } catch (err) {
      toast.error(errMsg(err))
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!venue) return
    if (!isOwner) {
      toast.error('Only the owner can delete this venue.')
      return
    }
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

  // ---- Render states ----
  if (loadingInitial) {
    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="body muted">Loading venue…</p>
      </main>
    )
  }

  if (loadError || !venue) {
    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="body text-red-600">{loadError ?? 'Venue not found'}</p>
      </main>
    )
  }

  if (!isOwner) {
    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="body text-red-600">
          You’re not allowed to edit this venue.
        </p>
      </main>
    )
  }

  // ---- UI ----
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="h1">Edit Venue</h1>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
      <p className="muted mb-8">Update your venue details below.</p>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Basics */}
        <section className="space-y-4 rounded-xl border border-black/10 bg-white p-5">
          <h2 className="h3">Basics</h2>

          <div>
            <label htmlFor="name" className="body mb-1 block">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2"
              placeholder="Cozy Mountain Cabin"
            />
            <FormError message={nameError} />
          </div>

          <div>
            <label htmlFor="description" className="body mb-1 block">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2"
              placeholder="Tell guests what makes your place special…"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="body mb-1 block">
                Price per night <span className="text-red-600">*</span>
              </label>
              <input
                id="price"
                type="number"
                min={1}
                inputMode="decimal"
                required
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full rounded-lg border border-black/15 px-3 py-2"
                placeholder="120"
              />
              <FormError message={priceError} />
            </div>

            <div>
              <label htmlFor="maxGuests" className="body mb-1 block">
                Max guests <span className="text-red-600">*</span>
              </label>
              <input
                id="maxGuests"
                type="number"
                min={1}
                required
                value={maxGuests}
                onChange={(e) =>
                  setMaxGuests(
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                className="w-full rounded-lg border border-black/15 px-3 py-2"
                placeholder="4"
              />
              <FormError message={maxGuestsError} />
            </div>
          </div>
        </section>

        {/* Media */}
        <section className="space-y-4 rounded-xl border border-black/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="h3">Media</h2>
            <button
              type="button"
              onClick={addMediaRow}
              className="inline-flex items-center rounded-lg border border-black/15 px-3 py-1.5 hover:bg-black/5 cursor-pointer"
            >
              Add image
            </button>
          </div>

          <div className="space-y-3">
            {media.map((m, idx) => (
              <div key={m.id} className="grid gap-3 sm:grid-cols-12">
                <div className="sm:col-span-7">
                  <label className="body mb-1 block">Image URL {idx + 1}</label>
                  <input
                    type="url"
                    value={m.url}
                    onChange={(e) =>
                      updateMediaRow(m.id, 'url', e.target.value)
                    }
                    placeholder="https://…"
                    className="w-full rounded-lg border border-black/15 px-3 py-2"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="body mb-1 block">Alt text</label>
                  <input
                    value={m.alt}
                    onChange={(e) =>
                      updateMediaRow(m.id, 'alt', e.target.value)
                    }
                    className="w-full rounded-lg border border-black/15 px-3 py-2"
                    placeholder="Front of the cabin at sunset"
                  />
                </div>
                <div className="sm:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeMediaRow(m.id)}
                    className="w-full rounded-lg border border-black/15 px-3 py-2 hover:bg-black/5 cursor-pointer disabled:opacity-50"
                    aria-label={`Remove image ${idx + 1}`}
                    disabled={media.length === 1}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Amenities */}
        <section className="space-y-4 rounded-xl border border-black/10 bg-white p-5">
          <h2 className="h3">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['wifi', 'parking', 'breakfast', 'pets'] as const).map((key) => (
              <label key={key} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={meta[key]}
                  onChange={(e) =>
                    setMeta({ ...meta, [key]: e.target.checked })
                  }
                />
                <span className="body capitalize">{key}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Location */}
        <section className="space-y-4 rounded-xl border border-black/10 bg-white p-5">
          <h2 className="h3">Location</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="body mb-1 block">Address</label>
              <input
                value={location.address}
                onChange={(e) =>
                  setLocation({ ...location, address: e.target.value })
                }
                className="w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </div>

            <div>
              <label className="body mb-1 block">City</label>
              <input
                value={location.city}
                onChange={(e) =>
                  setLocation({ ...location, city: e.target.value })
                }
                className="w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </div>

            <div>
              <label className="body mb-1 block">ZIP</label>
              <input
                value={location.zip}
                onChange={(e) =>
                  setLocation({ ...location, zip: e.target.value })
                }
                className="w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </div>

            <div>
              <label className="body mb-1 block">Country</label>
              <input
                value={location.country}
                onChange={(e) =>
                  setLocation({ ...location, country: e.target.value })
                }
                className="w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </div>

            <div>
              <label className="body mb-1 block">Continent</label>
              <input
                value={location.continent}
                onChange={(e) =>
                  setLocation({ ...location, continent: e.target.value })
                }
                className="w-full rounded-lg border border-black/15 px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="body mb-1 block">Latitude</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={location.lat ?? ''}
                  onChange={(e) =>
                    setLocation({
                      ...location,
                      lat: e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-black/15 px-3 py-2"
                  placeholder="60.3913"
                />
                <FormError message={latError} />
              </div>
              <div>
                <label className="body mb-1 block">Longitude</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={location.lng ?? ''}
                  onChange={(e) =>
                    setLocation({
                      ...location,
                      lng: e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-black/15 px-3 py-2"
                  placeholder="5.3221"
                />
                <FormError message={lngError} />
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-black/5 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || hasBlockingErrors}
            aria-busy={saving}
            className="inline-flex items-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </main>
  )
}
