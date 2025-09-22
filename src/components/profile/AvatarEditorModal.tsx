'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { updateMyAvatarAndSync } from '@/services/profiles'
import toast from 'react-hot-toast'
import { errMsg } from '@/utils/errors'
import type { TProfile } from '@/types/api'

type Props = {
  open: boolean
  onClose: () => void
  onSaved?: (p: TProfile) => void
}

/**
 * Accessible modal for updating avatar.
 */
export default function AvatarEditorModal({ open, onClose, onSaved }: Props) {
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [loading, setLoading] = useState(false)
  const titleId = 'avatar-editor-title'
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) {
      setUrl('')
      setAlt('')
      setLoading(false)
    }
  }, [open])

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  const previewUrl = useMemo(() => {
    if (!url) return ''
    try {
      const u = new URL(url)
      return u.protocol === 'http:' || u.protocol === 'https:' ? url : ''
    } catch {
      return ''
    }
  }, [url])

  if (!open) return null

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) {
      toast.error('Please provide an image URL.')
      return
    }
    setLoading(true)
    try {
      const updated = await updateMyAvatarAndSync(
        url.trim(),
        alt.trim() || undefined
      )
      onSaved?.(updated)
      toast.success('Avatar updated!')
      onClose()
    } catch (err) {
      toast.error(errMsg(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id={titleId} className="h3 mb-3">
          Update avatar
        </h3>

        <form onSubmit={onSave} className="space-y-4" aria-live="polite">
          <div>
            <label htmlFor="avatar-url" className="body mb-1 block">
              Image URL
            </label>
            <input
              id="avatar-url"
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-lg border border-black/15 px-3 py-2"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="avatar-alt" className="body mb-1 block">
              Alt text (optional)
            </label>
            <input
              id="avatar-alt"
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2"
            />
          </div>

          {previewUrl && (
            <div className="rounded-lg border border-black/10 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={alt || 'Avatar preview'}
                className="h-24 w-24 rounded-full object-cover"
              />
            </div>
          )}

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="inline-flex items-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
