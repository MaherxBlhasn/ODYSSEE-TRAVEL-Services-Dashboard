'use client'

import { useState } from 'react'
import { MapPin, Calendar, Star, Trash2, Eye } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ConfirmationModal from '../../../components/ui/ConfirmationModal'

interface Offer {
  id: string | number
  title: string
  destination: string
  duration: string
  image: string
  description: string
  shortDescription?: string
  rating: number
  available: boolean
}

interface OfferCardProps {
  offer: Offer
  onDelete: (id: string | number) => Promise<void>
  onToggleStatus: (id: string | number) => Promise<void>
}

export default function OfferCard({ offer, onDelete, onToggleStatus }: OfferCardProps) {
  const router = useRouter()
  const [showToggleModal, setShowToggleModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)



  const handleToggleClick = () => {
    setShowToggleModal(true)
  }

  const handleToggleConfirm = async () => {
    setIsToggling(true)
    try {
      await onToggleStatus(offer.id)
      setShowToggleModal(false)
    } catch (error) {
      console.error('Failed to toggle status:', error)
      // Keep modal open if there's an error
    } finally {
      setIsToggling(false)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await onDelete(offer.id)
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Failed to delete offer:', error)
      // Keep modal open if there's an error
    } finally {
      setIsDeleting(false)
    }
  }

  // Provide fallback for missing images
  const imageSrc = offer.image && offer.image.trim() !== ''
    ? offer.image
    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZSBBdmFpbGFibGU8L3RleHQ+PC9zdmc+'

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={imageSrc}
          alt={offer.title || 'Offer image'}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+'
          }}
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 text-xs rounded-full ${offer.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
          <span className="text-sm">{offer.duration} days</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-4 min-h-[4.5rem] leading-snug">
          {offer?.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{offer.rating}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/dashboard/offers/${offer.id}`)}
              className="px-3 py-1 text-sm rounded-lg transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              Details
            </button>
            <button
              onClick={handleToggleClick}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${offer.available
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
            >
              {offer.available ? 'Disable' : 'Enable'}
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Status Confirmation Modal */}
      <ConfirmationModal
        isOpen={showToggleModal}
        onClose={() => setShowToggleModal(false)}
        onConfirm={handleToggleConfirm}
        title={`${offer.available ? 'Disable' : 'Enable'} Offer`}
        message={
          <>
            Are you sure you want to {offer.available ? 'disable' : 'enable'}{' '}
            <span className="text-red-500 font-bold">{offer.title}</span> ?{' '}
            {offer.available
              ? 'This will make the offer unavailable to customers.'
              : 'This will make the offer available to customers.'}
          </>
        }
        confirmText={offer.available ? 'Disable' : 'Enable'}
        cancelText="Cancel"
        confirmVariant={offer.available ? 'danger' : 'default'}
        isLoading={isToggling}
      />


      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Offer"
        message={
          <>
            Are you sure you want to delete{' '}
            <span className="text-red-500 font-bold">{offer.title}</span>? This action
            cannot be undone and will permanently remove the offer from your dashboard.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
      />

    </div>
  )
}