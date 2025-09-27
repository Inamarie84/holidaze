import { redirect } from 'next/navigation'

/** Root of the (with-search) segment redirects to /venues. */
export default function Home() {
  redirect('/venues')
}
