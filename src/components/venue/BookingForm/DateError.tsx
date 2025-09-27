'use client'

import FormError from '@/components/ui/FormError'

/** Small adapter to reuse the shared inline error component for date issues. */
export default function DateError({ message }: { message: string | null }) {
  return message ? <FormError message={message} /> : null
}
