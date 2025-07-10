'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import OfferCard from '../components/OfferCard'
import { offers as initialOffers } from '../data'

export default function OffersSection() {
  const [offers, setOffers] = useState(initialOffers)
  const [showAddOffer, setShowAddOffer] = useState(false)
  const [newOffer, setNewOffer] = useState({
    title: '',
    destination: '',
    price: '',
    duration: '',
    image: '',
    description: '',
    rating: 5
  })

  const handleAddOffer = () => {
    if (newOffer.title && newOffer.destination && newOffer.price) {
      setOffers([...offers, {
        ...newOffer,
        id: Date.now(),
        available: true
      }])
      setNewOffer({
        title: '',
        destination: '',
        price: '',
        duration: '',
        image: '',
        description: '',
        rating: 5
      })
      setShowAddOffer(false)
    }
  }

  const handleDeleteOffer = (id: number) => {
    setOffers(offers.filter(offer => offer.id !== id))
  }

  const toggleOfferStatus = (id: number) => {
    setOffers(offers.map(offer => 
      offer.id === id ? { ...offer, available: !offer.available } : offer
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Travel Offers</h2>
        <button
          onClick={() => setShowAddOffer(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {offers.map(offer => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onDelete={handleDeleteOffer}
            onToggleStatus={toggleOfferStatus}
          />
        ))}
      </div>

      {/* Add Offer Modal */}
      {showAddOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Offer</h3>
              <button
                onClick={() => setShowAddOffer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newOffer.title}
                onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Destination"
                value={newOffer.destination}
                onChange={(e) => setNewOffer({...newOffer, destination: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Price (e.g., $1,299)"
                value={newOffer.price}
                onChange={(e) => setNewOffer({...newOffer, price: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 7 days)"
                value={newOffer.duration}
                onChange={(e) => setNewOffer({...newOffer, duration: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={newOffer.image}
                onChange={(e) => setNewOffer({...newOffer, image: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <textarea
                placeholder="Description"
                value={newOffer.description}
                onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-20 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddOffer}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition-colors"
                >
                  Add Offer
                </button>
                <button
                  onClick={() => setShowAddOffer(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}