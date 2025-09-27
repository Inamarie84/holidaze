'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { TVenueWithBookings } from '@/types/api'
import { deleteVenue } from '@/services/venues'
import { ts } from '@/utils/dates'

type Props = { venues: TVenueWithBookings[] }

function updatedAt(v: TVenueWithBookings) {
  return ts(v.updated) || ts(v.created)
}

/**
 * Grid of venues the manager owns, with quick actions.
 * Allows optimistic delete with rollback on failure.
 */
export default function ManagerVenues({ venues }: Props) {
  const [items, setItems] = useState<TVenueWithBookings[]>([])

  useEffect(() => {
    const list = Array.isArray(venues) ? [...venues] : []
    list.sort((a, b) => updatedAt(b) - updatedAt(a))
    setItems(list)
  }, [venues])

  async function onDelete(id: string) {
    if (!confirm('Delete this venue? This cannot be undone.')) return
    const prev = items
    setItems((cur) => cur.filter((v) => v.id !== id))
    try {
      await deleteVenue(id)
      toast.success('Venue deleted')
    } catch (err: unknown) {
      setItems(prev)
      const msg = err instanceof Error ? err.message : 'Failed to delete venue'
      toast.error(msg)
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-6 text-center">
        <p className="body muted mb-3">You haven’t created any venues yet.</p>
        <Link
          href="/venues/new"
          className="inline-flex items-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90 cursor-pointer"
        >
          Create venue
        </Link>
      </div>
    )
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((v) => {
        const img = v.media?.[0]?.url || '/images/placeholder.jpg'
        const alt = v.media?.[0]?.alt || v.name
        const city = v.location?.city ?? ''
        const country = v.location?.country ?? ''

        return (
          <li
            key={v.id}
            className="overflow-hidden rounded-xl border border-black/10 bg-white"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={img}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 50vw, 33vw"
              />
            </div>

            <div className="p-4">
              <h3 className="h3 mb-1">{v.name}</h3>
              <p className="muted text-sm">
                {city}
                {city && country ? ', ' : ''}
                {country}
              </p>

              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="inline-flex items-center rounded-full border border-black/10 px-2 py-0.5">
                  {`${v.price} NOK / night`}
                </span>
                <span className="inline-flex items-center rounded-full border border-black/10 px-2 py-0.5">
                  {`Max ${v.maxGuests}`}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/venues/${v.id}`}
                  className="inline-flex items-center rounded-lg border border-black/15 px-3 py-1.5 hover:bg-black/5"
                >
                  View
                </Link>
                <Link
                  href={`/venues/${v.id}/edit`}
                  className="inline-flex items-center rounded-lg bg-terracotta/90 px-3 py-1.5 text-white hover:opacity-90"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(v.id)}
                  aria-label={`Delete venue ${v.name}`}
                  className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-white hover:opacity-90 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
