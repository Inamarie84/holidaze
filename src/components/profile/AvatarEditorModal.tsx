// src/components/profile/AvatarEditorModal.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { updateMyAvatarAndSync } from '@/services/profiles'
import toast from 'react-hot-toast'
import { errMsg } from '@/utils/errors'

type Props = { open: boolean; onClose: () => void }

export default function AvatarEditorModal({ open, onClose }: Props) {
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [loading, setLoading] = useState(false)

  // Reset fields whenever the modal closes/opens
  useEffect(() => {
    if (!open) {
      setUrl('')
      setAlt('')
      setLoading(false)
    }
  }, [open])

  // 🔑 Always call hooks — even if the modal is closed.
  // Simple URL sanity check + preview
  const previewUrl = useMemo(() => {
    if (!url) return ''
    try {
      const u = new URL(url)
      return u.protocol === 'http:' || u.protocol === 'https:' ? url : ''
    } catch {
      return ''
    }
  }, [url])

  // After all hooks, you can render-null safely
  if (!open) return null

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) {
      toast.error('Please provide an image URL.')
      return
    }
    setLoading(true)
    try {
      await updateMyAvatarAndSync(url.trim(), alt.trim() || undefined)
      toast.success('Avatar updated!')
      onClose()
    } catch (err) {
      toast.error(errMsg(err))
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
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                  Saving…
                </span>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
