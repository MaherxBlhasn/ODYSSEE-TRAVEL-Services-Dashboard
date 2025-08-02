'use client'

import { useState, useEffect, useCallback } from 'react'
import { offers as initialOffers } from '../../data'
import { useSearchParams } from 'next/navigation';

import { offerService } from '../../../../lib/services/offer.service'
import { useOfferForm } from './hooks/useOfferForm'
import { NewOffer, ApiOffer, apiOfferToOffer } from './types'
import TabNavigation from './components/TabNavigation'
import OffersGrid from './components/OffersGrid'
import OfferForm from './components/OfferForm'
import MainImageUpload from './components/MainImageUpload'
import AdditionalImagesUpload from './components/AdditionalImagesUpload'
import { useOffers } from './context/OffersContext'

function OffersContent() {
  
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'add-offer' ? 'add-offer' : 'offers';

  const { offers, setOffers } = useOffers()
  const [activeTab, setActiveTab] = useState<'offers' | 'add-offer'>(defaultTab)
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

  // when coming from the dashboard section
  useEffect(() => {
    // If the user changes the URL manually, reflect that in the tab state
    const tab = searchParams.get('tab');
    if (tab === 'add-offer' || tab === 'offers') {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
  const fetchOffers = useCallback(async () => {
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
  }, [setOffers])

  // Load offers on component mount
  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  const handleAddOffer = async () => {
    clearValidationErrors()
    setError('')
    
    // Submit using the custom hook
    await submitOffer(newOffer, mainImage, additionalImages)
  }

  const handleDeleteOffer = async (id: string | number) => {
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

  const toggleOfferStatus = async (id: string | number) => {
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
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6" >
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
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="relative mb-6">
                  {/* Simple elegant spinner */}
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-orange-600 mx-auto"></div>
                </div>
                
                {/* Loading text */}
                <p className="text-gray-600 text-lg">Loading offers...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Offers */}
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Offers</p>
                      <p className="text-3xl font-bold text-gray-900">{offers.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Available Offers */}
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Available</p>
                      <p className="text-3xl font-bold text-green-600">{offers.filter(offer => offer.available).length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Unavailable Offers */}
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sold Out</p>
                      <p className="text-3xl font-bold text-red-600">{offers.filter(offer => !offer.available).length}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Average Rating */}
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {offers.length > 0 ? (offers.reduce((sum, offer) => sum + offer.rating, 0) / offers.length).toFixed(1) : '0.0'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offers Grid */}
              <OffersGrid 
                offers={offers}
                onDelete={handleDeleteOffer}
                onToggleStatus={toggleOfferStatus}
              />
            </>
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
