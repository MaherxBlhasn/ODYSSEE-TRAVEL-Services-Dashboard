'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, Star, Clock, Camera, Edit3, Save, X, Trash2, Upload,  Plus } from 'lucide-react'
import Image from 'next/image'
import { useOffers } from '../../components/offers/context/OffersContext'
import { offerService } from '../../../../lib/services/offer.service'
import ConfirmationModal from '../../../../components/ui/ConfirmationModal'
import UltimateLanguageSelector, { Language } from '../../components/UltimateLanguageSelector'

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
  // Multilingual support
  currentLanguage?: string
  translations?: {
    en: {
      title: string
      shortDescription: string
      bigDescription: string
      destination: string
    }
    fr: {
      title: string
      shortDescription: string
      bigDescription: string
      destination: string
    }
  }
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

interface UpdateOfferData {
  // Multilingual fields
  title_en?: string
  title_fr?: string
  destination_en?: string
  destination_fr?: string
  shortDescription_en?: string
  shortDescription_fr?: string
  bigDescription_en?: string
  bigDescription_fr?: string
  // Legacy fields (for backward compatibility)
  title?: string
  destination?: string
  duration?: string
  shortDescription?: string
  bigDescription?: string
  stars?: number
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
  
  // Edit mode states - simplified to match backend capabilities
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState<Partial<DetailedOffer>>({})
  const [newMainImage, setNewMainImage] = useState<File | null>(null)
  const [newAdditionalImages, setNewAdditionalImages] = useState<File[]>([])
  const [replaceAllGallery, setReplaceAllGallery] = useState(false)
  const [removeMainImage, setRemoveMainImage] = useState(false)
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([])
  const [addToGallery, setAddToGallery] = useState(false) // Flag to replace all gallery images
  const [isLoading, setIsLoading] = useState(false)
  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  // Language state for multilingual display
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en')
  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showLanguageSwitchModal, setShowLanguageSwitchModal] = useState(false)
  const [pendingLanguage, setPendingLanguage] = useState<Language | null>(null)
  // const [saveMessage, setSaveMessage] = useState('')

  const offerId = params.id as string

  // Helper function to get localized content based on provided language
  const getLocalizedContent = (offer: DetailedOffer, language: Language = selectedLanguage) => {
    if (!offer.translations) {
      // Fallback to default content if no translations available
      return {
        title: offer.title,
        destination: offer.destination,
        shortDescription: offer.shortDescription,
        description: offer.description
      }
    }

    const translation = offer.translations[language]
    if (translation) {
      return {
        title: translation.title,
        destination: translation.destination,
        shortDescription: translation.shortDescription,
        description: translation.bigDescription
      }
    }

    // Fallback to the other language if current selection isn't available
    const fallbackLang = language === 'en' ? 'fr' : 'en'
    const fallbackTranslation = offer.translations[fallbackLang]
    if (fallbackTranslation) {
      return {
        title: fallbackTranslation.title,
        destination: fallbackTranslation.destination,
        shortDescription: fallbackTranslation.shortDescription,
        description: fallbackTranslation.bigDescription
      }
    }

    // Final fallback to default content
    return {
      title: offer.title,
      destination: offer.destination,
      shortDescription: offer.shortDescription,
      description: offer.description
    }
  }

  // Get rating text based on star value
  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1:
        return 'Poor rating'
      case 2:
        return 'Fair rating'
      case 3:
        return 'Good rating'
      case 4:
        return 'Very good rating'
      case 5:
        return 'Excellent rating'
      default:
        return 'No rating'
    }
  }

  // Calculate gallery variables
  const allImages = offer ? [offer.image, ...(offer.additionalImages || [])] : []
  const selectedImage = allImages[selectedImageIndex]
  const totalImages = allImages.length

  

  useEffect(() => {
    const findOffer = async () => {
      try {
        setLoading(true)
        
        // Try context first - check both string and numeric comparison
        let foundOffer = offers.find(offer => 
          offer.id.toString() === offerId || offer.id === parseInt(offerId, 10)
        )
        
        if (!foundOffer && offers.length === 0) {
          // If context is empty, load from local data as fallback
          const { offers: localOffers } = await import('../../data')
          const numericId = parseInt(offerId, 10)
          foundOffer = localOffers.find((o: LocalOffer) => o.id === numericId)
        }
        
        if (foundOffer) {
          
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

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(hasUnsavedEditChanges())
  }, [editData, newMainImage, newAdditionalImages, imagesToRemove, removeMainImage, isEditMode])

  // Edit mode functions
  const enterEditMode = () => {
    if (offer) {
      // Get localized content for the currently selected language
      const localizedContent = getLocalizedContent(offer)
      
      setEditData({
        title: localizedContent.title,
        destination: localizedContent.destination,
        duration: offer.duration,
        shortDescription: localizedContent.shortDescription,
        description: localizedContent.description,
        rating: offer.rating,
      })
      setIsEditMode(true)
    }
  }

  // Handle language change during edit mode - reload edit data with new language content
  const handleLanguageChangeInEditMode = (newLanguage: Language) => {
    if (isEditMode && offer) {
      // Save current edit progress for language-independent fields
      const currentEditData = { ...editData }
      
      // Update language
      setSelectedLanguage(newLanguage)
      
      // Get content for the new language
      const newLocalizedContent = getLocalizedContent(offer, newLanguage)
      
      // Update edit data with new language content, but preserve language-independent fields
      setEditData({
        title: newLocalizedContent.title,
        destination: newLocalizedContent.destination,
        shortDescription: newLocalizedContent.shortDescription,
        description: newLocalizedContent.description,
        // Preserve language-independent fields
        duration: currentEditData.duration || offer.duration,
        rating: currentEditData.rating || offer.rating,
      })
    } else {
      // Normal language change when not in edit mode
      setSelectedLanguage(newLanguage)
    }
  }

  // Check if there are unsaved changes
  const hasUnsavedEditChanges = () => {
    if (!isEditMode || !offer) return false
    
    // Check if any field has been modified from initial state
    const currentData = getLocalizedContent(offer, selectedLanguage)
    
    return (
      (editData.title !== undefined && editData.title !== currentData.title) ||
      (editData.destination !== undefined && editData.destination !== currentData.destination) ||
      (editData.shortDescription !== undefined && editData.shortDescription !== currentData.shortDescription) ||
      (editData.description !== undefined && editData.description !== currentData.description) ||
      (editData.duration !== undefined && editData.duration !== offer.duration) ||
      (editData.rating !== undefined && editData.rating !== offer.rating) ||
      newMainImage !== null ||
      newAdditionalImages.length > 0 ||
      imagesToRemove.length > 0 ||
      removeMainImage
    )
  }

  // Safe language switching with unsaved changes check
  const handleLanguageChangeWithCheck = (newLanguage: Language) => {
    if (isEditMode && hasUnsavedEditChanges()) {
      setPendingLanguage(newLanguage)
      setShowLanguageSwitchModal(true)
    } else {
      handleLanguageChangeInEditMode(newLanguage)
    }
  }

  // Confirm language switch without saving
  const confirmLanguageSwitch = () => {
    if (pendingLanguage) {
      handleLanguageChangeInEditMode(pendingLanguage)
      setPendingLanguage(null)
    }
    setShowLanguageSwitchModal(false)
  }

  // Cancel language switch
  const cancelLanguageSwitch = () => {
    setPendingLanguage(null)
    setShowLanguageSwitchModal(false)
  }

  // Save changes before switching language
  const saveAndSwitchLanguage = async () => {
    try {
      await saveChanges()
      if (pendingLanguage && offer) {
        setSelectedLanguage(pendingLanguage)
        const newLocalizedContent = getLocalizedContent(offer, pendingLanguage)
        setEditData({
          title: newLocalizedContent.title,
          destination: newLocalizedContent.destination,
          shortDescription: newLocalizedContent.shortDescription,
          description: newLocalizedContent.description,
          duration: offer.duration,
          rating: offer.rating,
        })
        setPendingLanguage(null)
      }
      setShowLanguageSwitchModal(false)
    } catch (error) {
      console.error('Failed to save before switching language:', error)
      // Keep modal open if save fails
    }
  }

  const cancelEdit = () => {
    if (hasUnsavedEditChanges()) {
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
    setReplaceAllGallery(false)
    setRemoveMainImage(false)
    setImagesToRemove([])
    setAddToGallery(false)
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

  

  const toggleRemoveMainImage = () => {
    setRemoveMainImage(!removeMainImage)
    if (!removeMainImage) {
      setNewMainImage(null) // Clear new main image if removing
    }
  }

  const toggleRemoveGalleryImage = (imageUrl: string) => {
    setImagesToRemove(prev => {
      if (prev.includes(imageUrl)) {
        return prev.filter(url => url !== imageUrl)
      } else {
        return [...prev, imageUrl]
      }
    })
  }

  const saveChanges = async () => {
    if (!offer) return
    
    setIsLoading(true)
    setSaveStatus('saving')
    
    try {
      // Create update data - only include defined fields for the selected language
      const updateData: UpdateOfferData = {}
      
      // Only add fields that have been edited and are not empty
      if (editData.title && editData.title.trim() !== '') {
        if (selectedLanguage === 'en') {
          updateData.title_en = editData.title.trim()
        } else {
          updateData.title_fr = editData.title.trim()
        }
      }
      
      if (editData.destination && editData.destination.trim() !== '') {
        if (selectedLanguage === 'en') {
          updateData.destination_en = editData.destination.trim()
        } else {
          updateData.destination_fr = editData.destination.trim()
        }
      }
      
      if (editData.shortDescription && editData.shortDescription.trim() !== '') {
        if (selectedLanguage === 'en') {
          updateData.shortDescription_en = editData.shortDescription.trim()
        } else {
          updateData.shortDescription_fr = editData.shortDescription.trim()
        }
      }
      
      if (editData.description && editData.description.trim() !== '') {
        if (selectedLanguage === 'en') {
          updateData.bigDescription_en = editData.description.trim()
        } else {
          updateData.bigDescription_fr = editData.description.trim()
        }
      }
      
      // Duration and stars are language-independent
      if (editData.duration && editData.duration.toString().trim() !== '') {
        updateData.duration = editData.duration.toString().trim()
      }
      
      if (editData.rating && editData.rating > 0) {
        updateData.stars = editData.rating
      }

      console.log(`Sending update data for ${selectedLanguage}:`, updateData)

      // Call the update service with all flexible image operations
      await offerService.updateOffer(
        offer.id.toString(),
        updateData,
        newMainImage,
        newAdditionalImages.length > 0 ? newAdditionalImages : undefined,
        removeMainImage,
        imagesToRemove.length > 0 ? imagesToRemove : undefined,
        addToGallery,
        replaceAllGallery
      )

      // Update local state with the new language-specific content
      const updatedOffer = { ...offer }
      
      if (updatedOffer.translations) {
        // Update the specific language in translations
        if (editData.title) updatedOffer.translations[selectedLanguage].title = editData.title
        if (editData.destination) updatedOffer.translations[selectedLanguage].destination = editData.destination
        if (editData.shortDescription) updatedOffer.translations[selectedLanguage].shortDescription = editData.shortDescription
        if (editData.description) updatedOffer.translations[selectedLanguage].bigDescription = editData.description
      }
      
      // Update language-independent fields
      if (editData.rating) updatedOffer.rating = editData.rating
      if (editData.duration) updatedOffer.duration = editData.duration
      
      setOffer(updatedOffer)
      
      // Update offers context if needed
      setOffers(offers.map(o => o.id === offer.id ? { ...o, ...editData } : o))
      
      setSaveStatus('success')
      
      // Exit edit mode after successful save
      setIsEditMode(false)
      setEditData({})
      
      // Clear image edit states
      setNewMainImage(null)
      setNewAdditionalImages([])
      setImagesToRemove([])
      setRemoveMainImage(false)
      setAddToGallery(false)
      setReplaceAllGallery(false)
      
      // Redirect to offers list after successful save
      setTimeout(() => {
        router.push('/dashboard/offers')
      }, 1000) // 1 second delay to show success message
      
    } catch (error) {
      console.error('Failed to update offer:', error)
      setSaveStatus('error')
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
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
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Language Selector - Icon Only, positioned before Edit button */}
              {offer.translations && (
                <UltimateLanguageSelector
                  currentLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChangeWithCheck}
                  showLabel={false}
                  size="sm"
                  iconOnly={true}
                  className="self-start sm:self-center"
                />
              )}
              
              {isEditMode ? (
                <>
                  <button
                    onClick={cancelEdit}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={saveChanges}
                    disabled={isLoading || saveStatus === 'saving'}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base min-w-[120px] order-1 sm:order-2 ${
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
                    <span className="hidden sm:inline">
                      {saveStatus === 'saving' ? 'Saving...' : 
                       saveStatus === 'success' ? 'Saved!' : 
                       saveStatus === 'error' ? 'Failed' : 
                       'Save Changes'}
                    </span>
                    <span className="sm:hidden">
                      {saveStatus === 'saving' ? 'Saving...' : 
                       saveStatus === 'success' ? 'Saved!' : 
                       saveStatus === 'error' ? 'Error' : 
                       'Save'}
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={enterEditMode}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-sm sm:text-base"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Offer</span>
                  <span className="sm:hidden">Edit</span>
                </button>
              )}
              <span className={`px-3 py-1 text-sm rounded-full self-start sm:self-center ${
                offer.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {offer.available ? 'Available' : 'Sold Out'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Improved Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-xl overflow-hidden group">
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
              
              {/* Universal Replace Main Controls - Show on ANY Image in Edit Mode */}
              {isEditMode && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <label className="bg-white/95 text-gray-800 px-4 py-2 rounded-lg cursor-pointer hover:bg-white transition-colors flex items-center gap-2 shadow-lg backdrop-blur-sm">
                      <Upload className="w-4 h-4" />
                      <span className="hidden sm:inline">Replace Main</span>
                      <span className="sm:hidden">Replace</span>
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
                        className="bg-gray-600/95 text-white px-4 py-2 rounded-lg hover:bg-gray-700/95 transition-colors flex items-center gap-2 shadow-lg backdrop-blur-sm"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Cancel</span>
                      </button>
                    )}
                    {selectedImageIndex === 0 && (
                      <button
                        onClick={toggleRemoveMainImage}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg backdrop-blur-sm ${
                          removeMainImage 
                            ? 'bg-green-500/95 text-white hover:bg-green-600/95' 
                            : 'bg-red-500/95 text-white hover:bg-red-600/95'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">{removeMainImage ? 'Keep Main' : 'Remove Main'}</span>
                        <span className="sm:hidden">{removeMainImage ? 'Keep' : 'Remove'}</span>
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
                  <span className="ml-2 bg-green-500 px-2 py-0.5 rounded text-xs">NEW</span>
                )}
                {removeMainImage && selectedImageIndex === 0 && (
                  <span className="ml-2 bg-red-500 px-2 py-0.5 rounded text-xs">REMOVE</span>
                )}
              </div>

              {/* Edit Controls for Main Image */}
              {isEditMode && selectedImageIndex === 0 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {!removeMainImage && (
                    <label className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs cursor-pointer hover:bg-blue-600 transition-colors">
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files, true)
                          }
                        }}
                      />
                    </label>
                  )}
                  <button
                    onClick={toggleRemoveMainImage}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      removeMainImage 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {removeMainImage ? 'Keep' : 'Remove'}
                  </button>
                </div>
              )}
            </div>

            {/* Enhanced Gallery Section with Horizontal Carousel */}
            {(totalImages > 0 || (isEditMode && (newAdditionalImages.length > 0 || newMainImage))) && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-gray-600" />
                    Gallery ({totalImages + newAdditionalImages.length + (newMainImage ? 1 : 0)} images)
                  </h4>
                  
                  {/* Gallery Controls - Right next to title */}
                  {isEditMode && (
                    <div className="flex flex-wrap gap-2">
                      <label className="bg-blue-500 text-white px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors text-sm flex items-center gap-1.5">
                        <Plus className="w-4 h-4" />
                        Add Images
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files) {
                              handleImageUpload(e.target.files)
                              setAddToGallery(true)
                            }
                          }}
                        />
                      </label>

                      <label className="bg-orange-500 text-white px-3 py-1.5 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors text-sm flex items-center gap-1.5">
                        <Upload className="w-4 h-4" />
                        Replace All
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files) {
                              handleImageUpload(e.target.files)
                              setAddToGallery(false)
                              setReplaceAllGallery(true)
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                  
                  {!isEditMode && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <span>Scroll to browse</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Horizontal Scrolling Carousel with Arrows */}
                <div className="relative bg-gray-50 rounded-lg p-4">
                  {/* Left Arrow */}
                  <button 
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault()
                      const container = e.currentTarget.parentElement?.querySelector('.scrollable-container') as HTMLElement
                      if (container) {
                        container.scrollBy({ left: -100, behavior: 'smooth' })
                      }
                    }}
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Right Arrow */}
                  <button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault()
                      const container = e.currentTarget.parentElement?.querySelector('.scrollable-container') as HTMLElement
                      if (container) {
                        container.scrollBy({ left: 100, behavior: 'smooth' })
                      }
                    }}
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <div className="scrollable-container flex gap-3 overflow-x-auto scrollbar-hide py-2 px-2">
                    {/* Show new main image first if it exists */}
                    {isEditMode && newMainImage && (
                      <div className="relative group flex-shrink-0">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden border-2 border-dashed border-blue-400 shadow-sm">
                          <Image
                            src={URL.createObjectURL(newMainImage)}
                            alt="New main image"
                            fill
                            className="object-cover"
                          />
                          {/* New Main Image Overlay */}
                          <div className="absolute inset-0 bg-blue-500/70 flex items-center justify-center transition-all group-hover:bg-red-500/70">
                            <span className="text-white text-xs font-bold group-hover:hidden">NEW MAIN</span>
                            <button
                              onClick={() => setNewMainImage(null)}
                              className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                              title="Remove new main image"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Existing images */}
                    {allImages.map((img, index) => (
                      <div key={index} className="relative group flex-shrink-0">
                        <button
                          onClick={() => !isEditMode && setSelectedImageIndex(index)}
                          className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden transition-all shadow-sm ${
                            selectedImageIndex === index 
                              ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                              : 'hover:shadow-md hover:scale-102'
                          } ${
                            imagesToRemove.includes(img) ? 'opacity-50 ring-2 ring-red-400' : ''
                          }`}
                        >
                          {/* Loading State */}
                          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                          </div>
                          
                          <Image
                            src={img || '/globe.svg'}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                            onLoad={(e) => {
                              const target = e.target as HTMLImageElement
                              const loader = target.parentElement?.querySelector('.animate-pulse')
                              if (loader) loader.remove()
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/globe.svg'
                              const loader = target.parentElement?.querySelector('.animate-pulse')
                              if (loader) loader.remove()
                            }}
                          />
                          {index === 0 && !newMainImage && (
                            <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded font-medium">
                              MAIN
                            </div>
                          )}
                          {imagesToRemove.includes(img) && (
                            <div className="absolute inset-0 bg-red-500/60 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">REMOVE</span>
                            </div>
                          )}
                        </button>
                        
                        {/* Improved Remove Button for Gallery Images */}
                        {isEditMode && index > 0 && (
                          <button
                            onClick={() => toggleRemoveGalleryImage(img)}
                            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-white flex items-center justify-center text-xs font-bold transition-all shadow-md z-10 border border-white ${
                              imagesToRemove.includes(img)
                                ? 'bg-green-500 hover:bg-green-600 hover:scale-110'
                                : 'bg-red-500 hover:bg-red-600 hover:scale-110'
                            }`}
                            title={imagesToRemove.includes(img) ? 'Keep this image' : 'Remove this image'}
                          >
                            {imagesToRemove.includes(img) ? '✓' : '×'}
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {/* New Additional Images Preview */}
                    {newAdditionalImages.map((file, index) => (
                      <div key={`new-${index}`} className="relative group flex-shrink-0">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden border-2 border-dashed border-green-400 shadow-sm">
                          {/* Loading State for New Images */}
                          <div className="absolute inset-0 bg-green-50 animate-pulse flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-green-300 border-t-green-500 rounded-full animate-spin"></div>
                          </div>
                          
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`New image ${index + 1}`}
                            fill
                            className="object-cover"
                            onLoad={(e) => {
                              const target = e.target as HTMLImageElement
                              const loader = target.parentElement?.querySelector('.animate-pulse')
                              if (loader) loader.remove()
                            }}
                          />
                          {/* New Additional Image Overlay */}
                          <div className="absolute inset-0 bg-green-500/70 flex items-center justify-center transition-all group-hover:bg-red-500/70">
                            <span className="text-white text-xs font-bold group-hover:hidden">NEW</span>
                            <button
                              onClick={() => removeNewImage(index)}
                              className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                              title="Remove new image"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Compact Status Summary - Keep This One */}
            {isEditMode && (newAdditionalImages.length > 0 || imagesToRemove.length > 0 || removeMainImage || newMainImage) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Pending Changes
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  {newMainImage && (
                    <div>• New main image selected</div>
                  )}
                  {newAdditionalImages.length > 0 && (
                    <div>• Adding {newAdditionalImages.length} new image{newAdditionalImages.length > 1 ? 's' : ''}</div>
                  )}
                  {imagesToRemove.length > 0 && (
                    <div>• Removing {imagesToRemove.length} gallery image{imagesToRemove.length > 1 ? 's' : ''}</div>
                  )}
                  {removeMainImage && (
                    <div>• Removing main image</div>
                  )}
                </div>
              </div>
            )}

            {/* Single Image Add More Section - Only when no images and in edit mode */}
            {totalImages === 0 && isEditMode && newAdditionalImages.length === 0 && !newMainImage && (
              <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-dashed border-gray-300">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-3">No images yet</p>
                <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors text-sm flex items-center gap-2 mx-auto w-fit">
                  <Plus className="w-4 h-4" />
                  Add First Image
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleImageUpload(e.target.files)
                        setAddToGallery(true)
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Offer Details */}
          <div className="space-y-6">
            {/* Title and Rating - Show normally in view mode */}
            {!isEditMode && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{getLocalizedContent(offer).title}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold text-gray-900">{offer.rating}</span>
                  </div>
                  <span className="text-gray-500">• {getRatingText(offer.rating)}</span>
                </div>
              </div>
            )}

            {/* Edit Mode: Language-Independent Fields First */}
            {isEditMode && (
              <div className="space-y-6">
                {/* Language-Independent Fields Section */}
                <div className="bg-white rounded-lg border p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    Global Settings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="border border-gray-300 rounded-lg px-4 py-3 bg-white hover:border-orange-500 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-opacity-20 transition-all duration-200 h-12 flex items-center">
                        <div className="flex items-center gap-1 w-full">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => setEditData(prev => ({ ...prev, rating }))}
                              className={`p-1 rounded-md transition-all duration-200 hover:scale-110 ${
                                (editData.rating || offer.rating) >= rating
                                  ? 'text-yellow-400 hover:text-yellow-500'
                                  : 'text-gray-300 hover:text-yellow-300'
                              }`}
                              title={`${rating} star${rating !== 1 ? 's' : ''}`}
                            >
                              <Star className="w-5 h-5 fill-current" />
                            </button>
                          ))}
                          <span className="ml-4 text-sm text-gray-600 font-medium flex-1 whitespace-nowrap">
                            {editData.rating || offer.rating} star{(editData.rating || offer.rating) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={editData.duration || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full h-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-500 transition-all duration-200"
                        placeholder="7"
                      />
                    </div>
                  </div>
                </div>

                {/* Language-Specific Fields Section */}
                <div className="bg-white rounded-lg border p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${hasUnsavedChanges ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                    {selectedLanguage.toUpperCase()} Content
                    {hasUnsavedChanges && (
                      <span className="text-xs text-orange-600 ml-2 flex items-center gap-1">
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        Unsaved changes
                      </span>
                    )}
                    {!hasUnsavedChanges && (
                      <span className="text-xs text-blue-600 ml-2">
                        Use flag selector above to switch languages
                      </span>
                    )}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title ({selectedLanguage.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={editData.title || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder={`Enter title in ${selectedLanguage.toUpperCase()}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination ({selectedLanguage.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        value={editData.destination || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, destination: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder={`Enter destination in ${selectedLanguage.toUpperCase()}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Responsive Key Details - View Mode Only */}
            {!isEditMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="font-semibold text-gray-900 truncate">{getLocalizedContent(offer).destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                  <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500">Duration (days)</p>
                    <p className="font-semibold text-gray-900">{offer.duration} days</p>
                  </div>
                </div>
              </div>
            )}

            {/* Responsive Short Description */}
            <div className="bg-white rounded-lg border p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Overview 
                {isEditMode && (
                  <span className="text-sm text-blue-600 ml-2">
                    ({selectedLanguage.toUpperCase()})
                  </span>
                )}
              </h3>
              {isEditMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description ({selectedLanguage.toUpperCase()})
                  </label>
                  <textarea
                    value={editData.shortDescription || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, shortDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                    placeholder={`Enter short description in ${selectedLanguage.toUpperCase()}`}
                  />
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed break-words">{getLocalizedContent(offer).shortDescription}</p>
              )}
            </div>

            {/* Responsive Detailed Description */}
            <div className="bg-white rounded-lg border p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Detailed Description
                {isEditMode && (
                  <span className="text-sm text-blue-600 ml-2">
                    ({selectedLanguage.toUpperCase()})
                  </span>
                )}
              </h3>
              {isEditMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description ({selectedLanguage.toUpperCase()})
                  </label>
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                    placeholder={`Enter detailed description in ${selectedLanguage.toUpperCase()}`}
                  />
                </div>
              ) : (
                <div className="text-gray-600 leading-relaxed">
                  <p className="break-words overflow-wrap-anywhere whitespace-pre-wrap">{getLocalizedContent(offer).description}</p>
                </div>
              )}
            </div>

            {/* Edit Mode Action Buttons */}
            {isEditMode && (
              <div className="bg-white rounded-lg border p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    onClick={() => setShowDiscardModal(true)}
                    disabled={isLoading || saveStatus === 'saving'}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 ease-out font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <X className="w-4 h-4" />
                    Cancel Changes
                  </button>
                  <button
                    onClick={saveChanges}
                    disabled={isLoading || saveStatus === 'saving'}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 active:bg-green-800 transition-all duration-150 ease-out font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {(isLoading || saveStatus === 'saving') ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
                
                {/* Save Status Feedback */}
                {saveStatus === 'success' && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      Changes saved successfully!
                    </p>
                  </div>
                )}
                
                {saveStatus === 'error' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-2 h-2 text-white" />
                      </div>
                      Failed to save changes. Please try again.
                    </p>
                  </div>
                )}
              </div>
            )}

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

      {/* Confirmation Modal */}
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

      {/* Language Switch Modal */}
      {showLanguageSwitchModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelLanguageSwitch()
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                Unsaved Changes
              </h3>
              <button
                onClick={cancelLanguageSwitch}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">
                You have unsaved changes in <span className="font-semibold text-gray-900">{selectedLanguage.toUpperCase()}</span>. 
                What would you like to do before switching to <span className="font-semibold text-gray-900">{pendingLanguage?.toUpperCase()}</span>?
              </p>
            </div>
            
            {/* Actions */}
            <div className="p-6 pt-0 space-y-3">
              <button
                onClick={saveAndSwitchLanguage}
                disabled={isLoading || saveStatus === 'saving'}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 active:bg-green-800 transition-all duration-150 ease-out flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99]"
              >
                {(isLoading || saveStatus === 'saving') ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save & Switch to {pendingLanguage?.toUpperCase()}
                  </>
                )}
              </button>
              
              <button
                onClick={confirmLanguageSwitch}
                disabled={isLoading || saveStatus === 'saving'}
                className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl hover:bg-orange-700 active:bg-orange-800 transition-all duration-150 ease-out font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Switch Without Saving
              </button>
              
              <button
                onClick={cancelLanguageSwitch}
                disabled={isLoading || saveStatus === 'saving'}
                className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 ease-out font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
