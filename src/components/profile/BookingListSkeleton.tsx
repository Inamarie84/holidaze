//src/app/comonents/profile/BookingListSkeleton.tsx

'use client'
import Skeleton from '@/components/ui/Skeleton'

export default function BookingListSkeleton() {
  return (
    <ul className="divide-y divide-black/10 rounded-xl border border-black/10 bg-white">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </li>
      ))}
    </ul>
  )
}
