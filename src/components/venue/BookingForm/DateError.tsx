'use client'

import FormError from '@/components/ui/FormError'

export default function DateError({ message }: { message: string | null }) {
  return message ? <FormError message={message} /> : null
}
