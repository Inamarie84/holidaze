// src/services/profiles.ts
import { api } from '@/lib/api'

export const getProfile = (name: string, token: string) =>
  api(`/profiles/${name}`, { token, useApiKey: true })

export const updateProfile = (
  name: string,
  data: {
    bio?: string
    avatar?: { url: string; alt?: string }
    banner?: { url: string; alt?: string }
    venueManager?: boolean
  },
  token: string
) =>
  api(`/profiles/${name}`, {
    method: 'PUT',
    body: data,
    token,
    useApiKey: true,
  })

export const getProfileBookings = (name: string, token: string) =>
  api(`/profiles/${name}/bookings`, { token, useApiKey: true })

export const getProfileVenues = (name: string, token: string) =>
  api(`/profiles/${name}/venues`, { token, useApiKey: true })
