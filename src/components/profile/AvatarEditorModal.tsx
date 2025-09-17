// src/components/profile/AvatarEditorModal.tsx
'use client'

import { useState } from 'react'
import { updateMyAvatar } from '@/services/profiles'
import toast from 'react-hot-toast'

type Props = {
  open: boolean
  onClose: () => void
}

export default function AvatarEditorModal({ open, onClose }: Props) {
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    if (!url) {
      toast.error('Please provide an image URL.')
      return
    }
    setLoading(true)
    try {
      await updateMyAvatar(url, alt || undefined)
      toast.success('Avatar updated!')
      onClose()
      // simplest refresh to reflect new avatar in header
      window.location.reload()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update avatar'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h3 className="h3 mb-3">Update avatar</h3>
        <form onSubmit={onSave} className="space-y-4">
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

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-lg border border-black/15 px-4 py-2 hover:bg-black/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="inline-flex items-center rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
