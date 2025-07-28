'use client'

import { OffersProvider } from '../components/offers/context/OffersContext'

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OffersProvider>
      {children}
    </OffersProvider>
  )
}
