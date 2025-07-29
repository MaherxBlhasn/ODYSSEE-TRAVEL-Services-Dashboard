'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, Star, Clock, Camera, Edit3, Save, X, Trash2, Upload, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useOffers } from '../../components/offers/context/OffersContext'
import { offerService } from '../../../../lib/services/offer.service'
import ConfirmationModal from '../../../../components/ui/ConfirmationModal'

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
  const { offers, setOffers } = useOffers()
  const [offer, setOffer] = useState<DetailedOffer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState<Partial<DetailedOffer>>({})
  const [newMainImage, setNewMainImage] = useState<File | null>(null)
  const [newAdditionalImages, setNewAdditionalImages] = useState<File[]>([])
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteImageModal, setShowDeleteImageModal] = useState<number | null>(null)
  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState('')

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

  // Edit mode functions
  const enterEditMode = () => {
    if (offer) {
      setEditData({
        title: offer.title,
        destination: offer.destination,
        duration: offer.duration,
        shortDescription: offer.shortDescription,
        description: offer.description,
        rating: offer.rating,
      })
      setIsEditMode(true)
    }
  }

  const cancelEdit = () => {
    if (hasChanges()) {
      setShowDiscardModal(true)
    } else {
      resetEditMode()
    }
  }

  const resetEditMode = () => {
    setIsEditMode(false)
    setEditData({})
    setNewMainImage(null)
    setNewAdditionalImages([])
    setImagesToRemove([])
  }

  const hasChanges = () => {
    return newMainImage || newAdditionalImages.length > 0 || imagesToRemove.length > 0 ||
           JSON.stringify(editData) !== JSON.stringify({
             title: offer?.title,
             destination: offer?.destination,
             duration: offer?.duration,
             shortDescription: offer?.shortDescription,
             description: offer?.description,
             rating: offer?.rating,
           })
  }

  const handleImageUpload = (files: FileList, isMain: boolean = false) => {
    const fileArray = Array.from(files)
    if (isMain && fileArray.length > 0) {
      setNewMainImage(fileArray[0])
    } else {
      setNewAdditionalImages(prev => [...prev, ...fileArray])
    }
  }

  const removeNewImage = (index: number, isMain: boolean = false) => {
    if (isMain) {
      setNewMainImage(null)
    } else {
      setNewAdditionalImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const markImageForRemoval = (imageIndex: number) => {
    setImagesToRemove(prev => [...prev, imageIndex])
    setShowDeleteImageModal(null)
  }

  const saveChanges = async () => {
    if (!offer) return
    
    setIsLoading(true)
    setSaveStatus('saving')
    setSaveMessage('Saving your changes...')
    
    try {
      // Create update data - only include defined fields
      const updateData: any = {}
      
      // Only add fields that have been edited and are not empty
      if (editData.title && editData.title.trim() !== '') {
        updateData.title = editData.title.trim()
      }
      
      if (editData.destination && editData.destination.trim() !== '') {
        updateData.destination = editData.destination.trim()
      }
      
      if (editData.duration && editData.duration.toString().trim() !== '') {
        updateData.duration = parseInt(editData.duration.toString(), 10)
      }
      
      if (editData.shortDescription && editData.shortDescription.trim() !== '') {
        updateData.shortDescription = editData.shortDescription.trim()
      }
      
      if (editData.description && editData.description.trim() !== '') {
        updateData.bigDescription = editData.description.trim() // Note: backend uses 'bigDescription'
      }
      
      if (editData.rating && editData.rating > 0) {
        updateData.stars = editData.rating // Note: backend uses 'stars'
      }

      console.log('Sending update data:', updateData)

      // Call the update service
      await offerService.updateOffer(
        offer.id.toString(),
        updateData,
        newMainImage,
        newAdditionalImages
      )

      // Update local state - this is a simplified version
      // In a real app, you'd want to refetch the data
      const updatedOffer = {
        ...offer,
        ...editData,
        // Note: Image updates would need backend confirmation
      }
      
      setOffer(updatedOffer)
      
      // Update offers context if needed
      setOffers(offers.map(o => o.id === offer.id ? { ...o, ...editData } : o))
      
      setSaveStatus('success')
      setSaveMessage('Offer updated successfully!')
      
      // Navigate back to offers grid after a short delay
      setTimeout(() => {
        router.push('/dashboard/offers')
      }, 1500)
      
    } catch (error) {
      console.error('Failed to update offer:', error)
      setSaveStatus('error')
      setSaveMessage('Failed to update offer. Please try again.')
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
        setSaveMessage('')
      }, 3000)
    } finally {
      setIsLoading(false)
    }
  }

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
            <div className="flex items-center gap-3">
              {isEditMode ? (
                <>
                  <button
                    onClick={cancelEdit}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={saveChanges}
                    disabled={isLoading || saveStatus === 'saving'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                      saveStatus === 'success' 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : saveStatus === 'error'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {isLoading || saveStatus === 'saving' ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : saveStatus === 'success' ? (
                      <Save className="w-4 h-4" />
                    ) : saveStatus === 'error' ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saveStatus === 'saving' ? 'Saving...' : 
                     saveStatus === 'success' ? 'Saved!' : 
                     saveStatus === 'error' ? 'Failed' : 
                     'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={enterEditMode}
                  className="flex items-center gap-2 px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Offer
                </button>
              )}
              <span className={`px-3 py-1 text-sm rounded-full ${
                offer.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {offer.available ? 'Available' : 'Sold Out'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {saveMessage && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 ${
          saveStatus === 'success' ? 'text-green-700' : 
          saveStatus === 'error' ? 'text-red-700' : 
          'text-blue-700'
        }`}>
          <div className={`p-3 rounded-lg text-sm font-medium ${
            saveStatus === 'success' ? 'bg-green-50 border border-green-200' : 
            saveStatus === 'error' ? 'bg-red-50 border border-red-200' : 
            'bg-blue-50 border border-blue-200'
          }`}>
            {saveMessage}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden group">
              <Image
                src={newMainImage ? URL.createObjectURL(newMainImage) : selectedImage || '/globe.svg'}
                alt={offer.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/globe.svg'
                }}
              />
              
              {/* Edit mode overlay for main image */}
              {isEditMode && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                  <div className="flex gap-2">
                    <label className="bg-white text-gray-800 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {newMainImage ? 'Change Main' : 'Replace Main'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files, true)}
                      />
                    </label>
                    {newMainImage && (
                      <button
                        onClick={() => removeNewImage(0, true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Image Counter */}
              {totalImages > 1 && (
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium">
                  {selectedImageIndex + 1} / {totalImages}
                </div>
              )}
              
              {/* Navigation Arrows */}
              {totalImages > 1 && !isEditMode && (
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
                {newMainImage && selectedImageIndex === 0 && (
                  <span className="ml-2 bg-orange-500 px-2 py-0.5 rounded text-xs">NEW</span>
                )}
              </div>
            </div>

            {/* Image Thumbnails and Management */}
            {totalImages > 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">Gallery ({totalImages} images)</h4>
                  {isEditMode ? (
                    <div className="flex items-center gap-2">
                      <label className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-lg cursor-pointer hover:bg-orange-200 transition-colors flex items-center gap-2">
                        <Upload className="w-3 h-3" />
                        Add Images
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">Click to view</div>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {allImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <button
                        onClick={() => !isEditMode && setSelectedImageIndex(index)}
                        className={`relative w-full h-20 bg-gray-100 rounded-lg overflow-hidden transition-all transform hover:scale-105 ${
                          selectedImageIndex === index 
                            ? 'ring-2 ring-orange-500 opacity-100 shadow-lg' 
                            : 'opacity-70 hover:opacity-100'
                        } ${imagesToRemove.includes(index) ? 'opacity-30' : ''}`}
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
                        {imagesToRemove.includes(index) && (
                          <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">REMOVED</span>
                          </div>
                        )}
                      </button>
                      
                      {/* Edit mode controls */}
                      {isEditMode && index > 0 && (
                        <button
                          onClick={() => setShowDeleteImageModal(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {/* Show new images being added */}
                  {newAdditionalImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <div className="relative w-full h-20 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-orange-500">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1 rounded">
                          NEW
                        </div>
                        <button
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Single Image Message */}
            {totalImages === 1 && !isEditMode && (
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                <Camera className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Single image available</p>
              </div>
            )}

            {/* Add images section for edit mode */}
            {isEditMode && totalImages === 1 && (
              <div className="text-center py-6 bg-orange-50 rounded-lg border-2 border-dashed border-orange-200">
                <label className="cursor-pointer block">
                  <ImageIcon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <p className="text-sm text-orange-700 mb-2">Add more images to create a gallery</p>
                  <span className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Choose Images
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Offer Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              {isEditMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={editData.title || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter offer title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={editData.rating || 5}
                      onChange={(e) => setEditData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-semibold text-gray-900">{offer.rating}</span>
                    </div>
                    <span className="text-gray-500">• Excellent rating</span>
                  </div>
                </>
              )}
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <MapPin className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Destination</p>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editData.destination || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, destination: e.target.value }))}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter destination"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">{offer.destination}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Duration (days)</p>
                  {isEditMode ? (
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={editData.duration || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="7"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">{offer.duration} days</p>
                  )}
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
              {isEditMode ? (
                <textarea
                  value={editData.shortDescription || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Enter short description"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{offer.shortDescription}</p>
              )}
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Description</h3>
              {isEditMode ? (
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Enter detailed description"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{offer.description}</p>
              )}
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

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteImageModal !== null}
        onClose={() => setShowDeleteImageModal(null)}
        onConfirm={() => showDeleteImageModal !== null && markImageForRemoval(showDeleteImageModal)}
        title="Remove Image"
        message="Are you sure you want to remove this image from the gallery? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        confirmVariant="danger"
      />

      <ConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          resetEditMode()
          setShowDiscardModal(false)
        }}
        title="Discard Changes"
        message="Are you sure you want to discard all your changes? Any unsaved modifications will be lost."
        confirmText="Discard"
        cancelText="Keep Editing"
        confirmVariant="danger"
      />
    </div>
  )
}
