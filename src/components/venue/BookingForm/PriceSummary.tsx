'use client'

/**
 * Small cost breakdown for the current selection.
 */
export default function PriceSummary({
  price,
  nights,
  total,
}: {
  price: number
  nights: number
  total: number
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white/60 px-3 py-2">
      <div className="text-sm">
        {`${price} NOK / night`}
        {nights > 0 && (
          <span className="ml-2 opacity-80">
            {`× ${nights} = `}
            <b>{`${total} NOK`}</b>
          </span>
        )}
      </div>
    </div>
  )
}
