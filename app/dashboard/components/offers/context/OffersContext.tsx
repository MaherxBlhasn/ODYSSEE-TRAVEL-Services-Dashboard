'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Offer } from '../types'

interface OffersContextType {
  offers: Offer[]
  setOffers: (offers: Offer[]) => void
  getOfferById: (id: string) => Offer | undefined
}

const OffersContext = createContext<OffersContextType | undefined>(undefined)

export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>([])

  const getOfferById = (id: string): Offer | undefined => {
    const numericId = parseInt(id, 10)
    return offers.find(offer => offer.id === numericId)
  }

  return (
    <OffersContext.Provider value={{ offers, setOffers, getOfferById }}>
      {children}
    </OffersContext.Provider>
  )
}

export function useOffers() {
  const context = useContext(OffersContext)
  if (context === undefined) {
    throw new Error('useOffers must be used within an OffersProvider')
  }
  return context
}
