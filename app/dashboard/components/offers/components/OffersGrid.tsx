'use client'

import OfferCard from '../../OfferCard'
import { Offer } from '../types'

interface OffersGridProps {
  offers: Offer[]
  onDelete: (id: string | number) => Promise<void>
  onToggleStatus: (id: string | number) => Promise<void>
}

export default function OffersGrid({ offers, onDelete, onToggleStatus }: OffersGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {offers.map(offer => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  )
}
