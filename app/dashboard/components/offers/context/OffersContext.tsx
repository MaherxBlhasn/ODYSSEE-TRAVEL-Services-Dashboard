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
    // Try to find by exact string match first
    let foundOffer = offers.find(offer => offer.id.toString() === id)
    
    // If not found and the id is numeric, try parsing to number
    if (!foundOffer && !isNaN(Number(id))) {
      const numericId = parseInt(id, 10)
      foundOffer = offers.find(offer => offer.id === numericId)
    }
    
    return foundOffer
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
