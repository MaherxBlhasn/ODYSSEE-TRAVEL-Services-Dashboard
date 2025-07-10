'use client'

import { MapPin, Calendar, Star, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface Offer {
  id: number
  title: string
  destination: string
  price: string
  duration: string
  image: string
  description: string
  rating: number
  available: boolean
}

interface OfferCardProps {
  offer: Offer
  onDelete: (id: number) => void
  onToggleStatus: (id: number) => void
}

export default function OfferCard({ offer, onDelete, onToggleStatus }: OfferCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative w-full h-48">
        <Image 
          src={offer.image} 
          alt={offer.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 text-xs rounded-full ${
            offer.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {offer.available ? 'Available' : 'Sold Out'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{offer.destination}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{offer.duration}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-orange-600">{offer.price}</span>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{offer.rating}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onToggleStatus(offer.id)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                offer.available 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {offer.available ? 'Disable' : 'Enable'}
            </button>
            <button
              onClick={() => onDelete(offer.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}