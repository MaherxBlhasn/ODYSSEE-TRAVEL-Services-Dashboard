'use client'

import { useState, useEffect } from 'react'
import { offers as initialOffers } from '../../data'
import { offerService } from '../../../../lib/services/offer.service'
import { useOfferForm } from './hooks/useOfferForm'
import { Offer, NewOffer, ApiOffer, apiOfferToOffer } from './types'
import TabNavigation from './components/TabNavigation'
import OffersGrid from './components/OffersGrid'
import OfferForm from './components/OfferForm'
import MainImageUpload from './components/MainImageUpload'
import AdditionalImagesUpload from './components/AdditionalImagesUpload'
import { useOffers } from './context/OffersContext'

function OffersContent() {
  const { offers, setOffers } = useOffers()
  const [activeTab, setActiveTab] = useState<'offers' | 'add-offer'>('offers')
  const [mainImage, setMainImage] = useState<string>('')
  const [additionalImages, setAdditionalImages] = useState<string[]>([])
  const [isLoadingOffers, setIsLoadingOffers] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [newOffer, setNewOffer] = useState<NewOffer>({
    title: '',
    destination: '',
    duration: '',
    shortDescription: '',
    bigDescription: '',
    stars: 5
  })

  // Initialize offers with local data
  useEffect(() => {
    if (offers.length === 0) {
      setOffers(initialOffers)
    }
  }, [offers.length, setOffers])

  // Use the custom hook for form validation and submission
  const { isLoading, validationErrors, submitOffer, clearValidationErrors } = useOfferForm({
    onSuccess: () => {
      // Clear form and show success message
      setNewOffer({
        title: '',
        destination: '',
        duration: '',
        shortDescription: '',
        bigDescription: '',
        stars: 5
      })
      setMainImage('')
      setAdditionalImages([])
      setActiveTab('offers')
      setSuccess('Offer created successfully!')
      setTimeout(() => setSuccess(''), 3000)
      // Refresh offers list
      fetchOffers()
    },
    onError: (error) => {
      setError(error)
      setTimeout(() => setError(''), 5000)
    }
  })

  // Fetch offers from backend
  const fetchOffers = async () => {
    setIsLoadingOffers(true)
    try {
      const apiOffers: ApiOffer[] = await offerService.getOffers()
      console.log('Fetched offers from API:', apiOffers)
      
      // Validate and convert API offers to local display format
      const validOffers = apiOffers.filter(offer => 
        offer && offer.id && offer.title // Basic validation
      )
      
      if (validOffers.length !== apiOffers.length) {
        console.warn(`Filtered out ${apiOffers.length - validOffers.length} invalid offers`)
      }
      
      const convertedOffers = validOffers.map(apiOfferToOffer)
      console.log('Converted offers with image URLs:', convertedOffers.map(offer => ({ 
        id: offer.id, 
        title: offer.title, 
        image: offer.image 
      })))
      setOffers(convertedOffers)
      
      if (convertedOffers.length === 0) {
        setError('No valid offers found on server, showing local data')
        setTimeout(() => setError(''), 3000)
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error)
      // Keep using local data if API fails
      setError('Failed to load offers from server, showing local data')
      setTimeout(() => setError(''), 3000)
    } finally {
      setIsLoadingOffers(false)
    }
  }

  // Load offers on component mount
  useEffect(() => {
    fetchOffers()
  }, [])

  const handleAddOffer = async () => {
    clearValidationErrors()
    setError('')
    
    // Submit using the custom hook
    await submitOffer(newOffer, mainImage, additionalImages)
  }

  const handleDeleteOffer = async (id: number) => {
    try {
      await offerService.deleteOffer(id.toString())
      setOffers(offers.filter(offer => offer.id !== id))
      setSuccess('Offer deleted successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to delete offer')
      setTimeout(() => setError(''), 3000)
      console.error('Failed to delete offer:', error)
    }
  }

  const toggleOfferStatus = async (id: number) => {
    const offer = offers.find(o => o.id === id)
    if (!offer) return

    try {
      await offerService.toggleOfferStatus(id.toString(), !offer.available)
      setOffers(offers.map(offer => 
        offer.id === id ? { ...offer, available: !offer.available } : offer
      ))
    } catch (error) {
      setError('Failed to update offer status')
      setTimeout(() => setError(''), 3000)
      console.error('Failed to toggle offer status:', error)
    }
  }

  const handleCancel = () => {
    setActiveTab('offers')
    clearValidationErrors()
    setError('')
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'offers' ? (
        // Travel Offers Screen
        <div>
          {isLoadingOffers ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading offers...</p>
            </div>
          ) : (
            <OffersGrid 
              offers={offers}
              onDelete={handleDeleteOffer}
              onToggleStatus={toggleOfferStatus}
            />
          )}
        </div>
      ) : (
        // Add Offer Screen
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Form */}
            <div className="lg:col-span-2">
              <OfferForm
                newOffer={newOffer}
                setNewOffer={setNewOffer}
                onSubmit={handleAddOffer}
                onCancel={handleCancel}
                isLoading={isLoading}
                validationErrors={validationErrors}
              />
            </div>

            {/* Image Upload Section */}
            <div className="lg:col-span-1 space-y-6">
              <MainImageUpload 
                mainImage={mainImage}
                setMainImage={setMainImage}
                validationError={validationErrors.mainImage?.[0]}
              />
              
              <AdditionalImagesUpload 
                additionalImages={additionalImages}
                setAdditionalImages={setAdditionalImages}
                validationErrors={validationErrors.additionalImages}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OffersSection() {
  return <OffersContent />
}
