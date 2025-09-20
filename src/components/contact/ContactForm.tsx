'use client'

export default function ContactForm() {
  return (
    <form
      className="space-y-4 rounded-xl border border-black/10 bg-white p-5"
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const subject = encodeURIComponent(
          `[Holidaze] ${String(data.get('subject') || 'Message')}`
        )
        const body = encodeURIComponent(
          `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
        )
        window.location.href = `mailto:support@holidaze.example?subject=${subject}&body=${body}`
      }}
    >
      <div>
        <label className="body mb-1 block" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
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
          className="w-full rounded-lg border border-black/15 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-emerald px-5 py-2.5 text-white hover:opacity-90"
      >
        Send email
      </button>
    </form>
  )
}
