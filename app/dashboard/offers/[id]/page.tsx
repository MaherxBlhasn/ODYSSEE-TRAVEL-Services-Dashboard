'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, Star, Clock, Camera } from 'lucide-react'
import Image from 'next/image'
import { useOffers } from '../../components/offers/context/OffersContext'

interface DetailedOffer {
  id: string | number
  title: string
  destination: string
  duration: string
  image: string
  description: string
  shortDescription: string
  rating: number
  available: boolean
  additionalImages?: string[]
  createdAt?: string
  updatedAt?: string
}

interface LocalOffer {
  id: string | number
  title: string
  destination: string
  duration: string
  image: string
  description: string
  shortDescription: string
  rating: number
  available: boolean
  additionalImages?: string[]
}

export default function OfferDetailPage() {
  return <OfferDetailContent />
}

function OfferDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { offers } = useOffers()
  const [offer, setOffer] = useState<DetailedOffer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const offerId = params.id as string
  console.log("FROM OFFER DETAIL PAGE:", offerId, typeof offerId, offer);

  // Calculate gallery variables
  const allImages = offer ? [offer.image, ...(offer.additionalImages || [])] : []
  const selectedImage = allImages[selectedImageIndex]
  const totalImages = allImages.length

  console.log('🎭 Gallery data:', {
    mainImage: offer?.image,
    additionalImages: offer?.additionalImages,
    totalImages,
    selectedIndex: selectedImageIndex,
    selectedImage
  })

  useEffect(() => {
    const findOffer = async () => {
      try {
        setLoading(true)
        console.log('Looking for offer with ID:', offerId, 'Type:', typeof offerId)
        console.log('Available offers:', offers)
        console.log('Offers IDs:', offers.map(o => ({ id: o.id, type: typeof o.id })))
        
        // Try context first - check both string and numeric comparison
        let foundOffer = offers.find(offer => 
          offer.id.toString() === offerId || offer.id === parseInt(offerId, 10)
        )
        console.log('Found offer in context:', foundOffer)
        
        if (!foundOffer && offers.length === 0) {
          console.log('Context is empty, loading from local data...')
          // If context is empty, load from local data as fallback
          const { offers: localOffers } = await import('../../data')
          console.log('Local offers loaded:', localOffers)
          const numericId = parseInt(offerId, 10)
          foundOffer = localOffers.find((o: LocalOffer) => o.id === numericId)
          console.log('Found offer in local data:', foundOffer)
        }
        
        if (foundOffer) {
          console.log('📸 Found offer data:', foundOffer)
          console.log('🖼️ Main image:', foundOffer.image)
          console.log('🎨 Additional images:', foundOffer.additionalImages)
          
          setOffer({
            ...foundOffer,
            shortDescription: foundOffer.shortDescription || foundOffer.description.substring(0, 150) + '...',
            additionalImages: foundOffer.additionalImages || []
          })
        } else {
          console.error('Offer not found with ID:', offerId)
          setError('Offer not found')
        }
      } catch (error) {
        console.error('Error finding offer:', error)
        setError('Failed to load offer details')
      } finally {
        setLoading(false)
      }
    }

    findOffer()
  }, [offerId, offers])

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!offer || totalImages <= 1) return
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setSelectedImageIndex(selectedImageIndex === 0 ? totalImages - 1 : selectedImageIndex - 1)
          break
        case 'ArrowRight':
          e.preventDefault()
          setSelectedImageIndex(selectedImageIndex === totalImages - 1 ? 0 : selectedImageIndex + 1)
          break
        case 'Escape':
          e.preventDefault()
          setSelectedImageIndex(0)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [offer, selectedImageIndex, totalImages])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading offer details...</p>
        </div>
      </div>
    )
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Offer Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested offer could not be found.'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Offers</span>
            </button>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-sm rounded-full ${
                offer.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {offer.available ? 'Available' : 'Sold Out'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden group">
              <Image
                src={selectedImage || '/globe.svg'}
                alt={offer.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/globe.svg'
                }}
              />
              
              {/* Image Counter */}
              {totalImages > 1 && (
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium">
                  {selectedImageIndex + 1} / {totalImages}
                </div>
              )}
              
              {/* Navigation Arrows */}
              {totalImages > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(selectedImageIndex === 0 ? totalImages - 1 : selectedImageIndex - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(selectedImageIndex === totalImages - 1 ? 0 : selectedImageIndex + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </>
              )}
              
              {/* Image Type Badge */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-xs">
                {selectedImageIndex === 0 ? 'Main Image' : `Gallery ${selectedImageIndex}`}
              </div>
            </div>

            {/* Image Thumbnails */}
            {totalImages > 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Gallery ({totalImages} images)</h4>
                  <div className="text-xs text-gray-500">Click to view</div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-full h-20 bg-gray-100 rounded-lg overflow-hidden transition-all transform hover:scale-105 ${
                        selectedImageIndex === index 
                          ? 'ring-2 ring-orange-500 opacity-100 shadow-lg' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img || '/globe.svg'}
                        alt={`${offer.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/globe.svg'
                        }}
                      />
                      {/* Thumbnail Badge */}
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Single Image Message */}
            {totalImages === 1 && (
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                <Camera className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Single image available</p>
              </div>
            )}
          </div>

          {/* Offer Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold text-gray-900">{offer.rating}</span>
                </div>
                <span className="text-gray-500">• Excellent rating</span>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <MapPin className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-semibold text-gray-900">{offer.destination}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-900">{offer.duration} days</p>
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
              <p className="text-gray-600 leading-relaxed">{offer.shortDescription}</p>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{offer.description}</p>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
              <div className="space-y-3 text-sm text-gray-600">
                {offer.createdAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Created: {new Date(offer.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {offer.updatedAt && offer.updatedAt !== offer.createdAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Updated: {new Date(offer.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
                
                {/* Enhanced Image Information */}
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4" />
                    <span className="font-medium">Gallery Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div>
                      <span className="text-gray-500">Total Images:</span>
                      <span className="ml-2 font-medium">{totalImages}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Additional:</span>
                      <span className="ml-2 font-medium">{(offer.additionalImages?.length || 0)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Main Image:</span>
                      <span className="ml-2 font-medium">✓ Available</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Gallery:</span>
                      <span className="ml-2 font-medium">
                        {totalImages > 1 ? '✓ Available' : '✗ Single image'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
