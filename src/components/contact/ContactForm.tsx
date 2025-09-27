'use client'

import * as React from 'react'

/**
 * Lightweight contact form that opens the user's email client with a pre-filled
 * subject and body (mailto:). No backend submission required.
 */
export default function ContactForm() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const subject = encodeURIComponent(
      `[Holidaze] ${String(data.get('subject') || 'Message')}`
    )
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
    )
    window.location.href = `mailto:support@holidaze.com?subject=${subject}&body=${body}`
  }

  return (
    <form
      className="space-y-4 rounded-xl border border-black/10 bg-white p-5"
      onSubmit={onSubmit}
      noValidate
    >
      <div>
        <label className="body mb-1 block" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-lg border border-black/15 px-3 py-2"
        />
      </div>

      <div>
        <label className="body mb-1 block" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          inputMode="email"
          className="w-full rounded-lg border border-black/15 px-3 py-2"
        />
      </div>

      <div>
        <label className="body mb-1 block" htmlFor="subject">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          required
          className="w-full rounded-lg border border-black/15 px-3 py-2"
        />
      </div>

      <div>
        <label className="body mb-1 block" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-lg border border-black/15 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90 cursor-pointer"
      >
        Send email
      </button>
    </form>
  )
}
