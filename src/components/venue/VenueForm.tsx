'use client'

import { useMemo, useState } from 'react'
import FormError from '@/components/ui/FormError'
import type { VenueFormValues, MediaField } from '@/types/forms'

type Props = {
  mode: 'create' | 'edit'
  initialValues?: Partial<VenueFormValues>
  submitting?: boolean
  submitLabel?: string
  onSubmit: (values: VenueFormValues) => void
  onCancel?: () => void
  onDelete?: () => void // only shown if provided (for Edit)
}

const emptyValues: VenueFormValues = {
  name: '',
  description: '',
  price: '',
  maxGuests: '',
  media: [
    {
      id:
        typeof crypto !== 'undefined'
          ? crypto.randomUUID()
          : String(Math.random()),
      url: '',
      alt: '',
    },
  ],
  meta: { wifi: false, parking: false, breakfast: false, pets: false },
  location: { address: '', city: '', zip: '', country: '' },
}

export default function VenueForm({
  mode,
  initialValues,
  submitting = false,
  submitLabel,
  onSubmit,
  onCancel,
  onDelete,
}: Props) {
  // merge defaults + initialValues (deep-ish)
  const start = useMemo(() => {
    const v = { ...emptyValues, ...initialValues }
    return {
      ...v,
      media: (initialValues?.media && initialValues.media.length
        ? initialValues.media
        : emptyValues.media
      ).map((m) => ({
        id: m.id ?? crypto.randomUUID(),
        url: m.url ?? '',
        alt: m.alt ?? '',
      })),
      meta: { ...emptyValues.meta, ...(initialValues?.meta ?? {}) },
      location: { ...emptyValues.location, ...(initialValues?.location ?? {}) },
    } as VenueFormValues
  }, [initialValues])

  // local state
  const [name, setName] = useState(start.name)
  const [description, setDescription] = useState(start.description)
  const [price, setPrice] = useState<number | ''>(start.price)
  const [maxGuests, setMaxGuests] = useState<number | ''>(start.maxGuests)
  const [media, setMedia] = useState<MediaField[]>(start.media)
  const [meta, setMeta] = useState(start.meta)
  const [location, setLocation] = useState(start.location)

  // validation
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

  const hasBlockingErrors = !!nameError || !!priceError || !!maxGuestsError

  // media handlers
  function addMediaRow() {
    setMedia((m) => [...m, { id: crypto.randomUUID(), url: '', alt: '' }])
  }
  function removeMediaRow(id: string) {
    setMedia((m) => m.filter((x) => x.id !== id))
  }
  function updateMediaRow(id: string, field: 'url' | 'alt', value: string) {
    setMedia((m) => m.map((x) => (x.id === id ? { ...x, [field]: value } : x)))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting || hasBlockingErrors) return
    onSubmit({
      name: name.trim(),
      description: description,
      price,
      maxGuests,
      media,
      meta,
      location: {
        address: location.address,
        city: location.city,
        zip: location.zip,
        country: location.country,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
                  onChange={(e) => updateMediaRow(m.id, 'url', e.target.value)}
                  placeholder="https://…"
                  className="w-full rounded-lg border border-black/15 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="body mb-1 block">Alt text</label>
                <input
                  value={m.alt}
                  onChange={(e) => updateMediaRow(m.id, 'alt', e.target.value)}
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
                onChange={(e) => setMeta({ ...meta, [key]: e.target.checked })}
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
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-black/5 cursor-pointer"
          >
            Cancel
          </button>
        )}
        {onDelete && mode === 'edit' && (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white hover:opacity-90"
          >
            Delete
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || hasBlockingErrors}
          aria-busy={submitting}
          className="inline-flex items-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
        >
          {submitting
            ? mode === 'create'
              ? 'Creating…'
              : 'Saving…'
            : (submitLabel ??
              (mode === 'create' ? 'Create Venue' : 'Save changes'))}
        </button>
      </div>
    </form>
  )
}
