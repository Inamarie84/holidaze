'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { updateMyAvatar } from '@/services/profiles'
import type { TProfile } from '@/types/api'

export default function ProfileHeader({ profile }: { profile: TProfile }) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar?.url ?? '')
  const [saving, setSaving] = useState(false)

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      await updateMyAvatar(avatarUrl || '/images/placeholder.jpg')
      toast.success('Avatar updated')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-full border border-black/10 bg-white">
        <Image
          src={profile.avatar?.url || '/images/placeholder.jpg'}
          alt={profile.avatar?.alt || profile.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex-1">
        <h1 className="h2">{profile.name}</h1>
        <p className="muted">{profile.email}</p>
        <form onSubmit={onSave} className="mt-3 flex gap-2">
          <input
            type="url"
            placeholder="Avatar image URL"
            className="w-full rounded-lg border border-black/15 px-3 py-2"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          <button
            disabled={saving}
            className="rounded-lg bg-emerald px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  )
}
