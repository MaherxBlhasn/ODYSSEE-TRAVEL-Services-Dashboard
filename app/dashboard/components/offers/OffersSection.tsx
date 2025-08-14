'use client'

import { useState, useEffect, useCallback } from 'react'
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
  const [filters, setFilters] = useState({
    availability: 'all', // 'all', 'available', 'unavailable'
    rating: 'all', // 'all', '5', '4+', '3+'
    search: '',
    sortBy: 'newest' // 'newest', 'oldest', 'rating-high', 'rating-low', 'title'
  })
  const [newOffer, setNewOffer] = useState<NewOffer>({
    // English fields
    title_en: '',
    destination_en: '',
    shortDescription_en: '',
    bigDescription_en: '',
    // French fields
    title_fr: '',
    destination_fr: '',
    shortDescription_fr: '',
    bigDescription_fr: '',
    // Common fields
    duration: '',
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

  // Remove automatic initialization with local data
  // Let the component show empty state when no real offers are available

  // Use the custom hook for form validation and submission
  const { isLoading, validationErrors, submitOffer, clearValidationErrors } = useOfferForm({
    onSuccess: () => {
      // Clear form and show success message
      setNewOffer({
        // English fields
        title_en: '',
        destination_en: '',
        shortDescription_en: '',
        bigDescription_en: '',
        // French fields
        title_fr: '',
        destination_fr: '',
        shortDescription_fr: '',
        bigDescription_fr: '',
        // Common fields
        duration: '',
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
      const apiOffers: ApiOffer[] = await offerService.getOffers('en', true)
      console.log('Fetched offers from API:', apiOffers)
      
      // Ensure we have an array
      if (!Array.isArray(apiOffers)) {
        console.error('API did not return an array:', apiOffers)
        setOffers([])
        setIsLoadingOffers(false)
        return
      }
      
      // Validate and convert API offers to local display format
      const validOffers = apiOffers.filter(offer => 
        offer && offer.id && (offer.title_en || offer.title_fr || offer.title) // Support multilingual
      )
      
      if (validOffers.length !== apiOffers.length) {
        console.warn(`Filtered out ${apiOffers.length - validOffers.length} invalid offers`)
      }
      
      const convertedOffers = validOffers.map(offer => apiOfferToOffer(offer, 'en'))
      console.log('Converted offers with image URLs:', convertedOffers.map(offer => ({ 
        id: offer.id, 
        title: offer.title, 
        image: offer.image 
      })))
      setOffers(convertedOffers)
      
      if (convertedOffers.length === 0) {
        console.log('No offers found on server')
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error)
      // Don't fall back to local data, just show empty state
      setError('Failed to load offers from server')
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

  // Filter and sort offers
  const filteredOffers = offers.filter(offer => {
    // Search filter
    if (filters.search && !offer.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !offer.destination.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    // Availability filter
    if (filters.availability === 'available' && !offer.available) return false
    if (filters.availability === 'unavailable' && offer.available) return false
    
    // Rating filter
    if (filters.rating === '5' && offer.rating !== 5) return false
    if (filters.rating === '4+' && offer.rating < 4) return false
    if (filters.rating === '3+' && offer.rating < 3) return false
    
    return true
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'oldest':
        // Sort by creation date (oldest first)
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) * 1000
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) * 1000
        return dateA - dateB
      case 'rating-high':
        return b.rating - a.rating
      case 'rating-low':
        return a.rating - b.rating
      case 'newest':
      default:
        // Sort by creation date (newest first)
        const dateANew = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) * 1000
        const dateBNew = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) * 1000
        return dateBNew - dateANew
    }
  })

  const resetFilters = () => {
    setFilters({
      availability: 'all',
      rating: 'all',
      search: '',
      sortBy: 'newest'
    })
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
              {/* Show empty state if no offers, otherwise show all features */}
              {offers.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
                  <div className="w-32 h-32 mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1m16 0H4" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-700 mb-4">No offers available</h3>
                  <p className="text-gray-500 mb-12 max-w-lg text-lg leading-relaxed">
                    You haven&apos;t created any travel offers yet. Start by adding your first offer to showcase amazing destinations and experiences.
                  </p>
                  <button
                    onClick={() => setActiveTab('add-offer')}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Your First Offer
                  </button>
                </div>
              ) : (
                <>
                  {/* Interactive Filter Cards */}
                  <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Quick Filters</h3>
                    <p className="text-sm text-gray-500">Click any card below to filter offers instantly</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* All Offers Filter */}
                  <div className="relative group">
                    <button
                      onClick={() => setFilters({...filters, availability: 'all', rating: 'all'})}
                      className={`${
                        filters.availability === 'all' && filters.rating === 'all'
                          ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 ring-4 ring-blue-200 scale-105' 
                          : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700'
                      } rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 group text-left w-full relative overflow-hidden`}
                    >
                      {/* Active indicator */}
                      {filters.availability === 'all' && filters.rating === 'all' && (
                        <div className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-50 opacity-90 mb-1">All Offers</p>
                          <p className="text-4xl font-extrabold text-white mb-1">{offers.length}</p>
                          <p className="text-xs text-blue-100 opacity-80">📋 Show everything</p>
                        </div>
                        <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:bg-white/25 transition-all duration-500 group-hover:rotate-6">
                          <svg className="w-7 h-7 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                      <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                        Reset all filters and show all offers
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>

                  {/* Available Offers Filter */}
                  <div className="relative group">
                    <button
                      onClick={() => setFilters({...filters, availability: 'available'})}
                      className={`${
                        filters.availability === 'available' 
                          ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 ring-4 ring-emerald-200 scale-105' 
                          : 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700'
                      } rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 group text-left w-full relative overflow-hidden`}
                    >
                      {/* Active indicator */}
                      {filters.availability === 'available' && (
                        <div className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-emerald-50 opacity-90 mb-1">Available</p>
                          <p className="text-4xl font-extrabold text-white mb-1">{offers.filter(offer => offer.available).length}</p>
                          <p className="text-xs text-emerald-100 opacity-80">✅ Ready to book</p>
                        </div>
                        <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:bg-white/25 transition-all duration-500 group-hover:rotate-6">
                          <svg className="w-7 h-7 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                      <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                        Show only bookable offers
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>

                  {/* Sold Out Offers Filter */}
                  <div className="relative group">
                    <button
                      onClick={() => setFilters({...filters, availability: 'unavailable'})}
                      className={`${
                        filters.availability === 'unavailable' 
                          ? 'bg-gradient-to-br from-orange-600 via-red-500 to-red-600 ring-4 ring-orange-200 scale-105' 
                          : 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 hover:from-orange-600 hover:via-red-500 hover:to-red-600'
                      } rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 group text-left w-full relative overflow-hidden`}
                    >
                      {/* Active indicator */}
                      {filters.availability === 'unavailable' && (
                        <div className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-amber-50 opacity-90 mb-1">Sold Out</p>
                          <p className="text-4xl font-extrabold text-white mb-1">{offers.filter(offer => !offer.available).length}</p>
                          <p className="text-xs text-amber-100 opacity-80">❌ Temporarily unavailable</p>
                        </div>
                        <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:bg-white/25 transition-all duration-500 group-hover:rotate-6">
                          <svg className="w-7 h-7 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                      <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                        Show unavailable offers only
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>

                  {/* High Rated Filter */}
                  <div className="relative group">
                    <button
                      onClick={() => setFilters({...filters, rating: '4+'})}
                      className={`${
                        filters.rating === '4+' 
                          ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-purple-700 ring-4 ring-violet-200 scale-105' 
                          : 'bg-gradient-to-br from-violet-400 via-purple-500 to-purple-600 hover:from-violet-500 hover:via-purple-600 hover:to-purple-700'
                      } rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 group text-left w-full relative overflow-hidden`}
                    >
                      {/* Active indicator */}
                      {filters.rating === '4+' && (
                        <div className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-violet-50 opacity-90 mb-1">Top Rated</p>
                          <p className="text-4xl font-extrabold text-white mb-1">{offers.filter(offer => offer.rating >= 4).length}</p>
                          <p className="text-xs text-violet-100 opacity-80">⭐ 4+ star experiences</p>
                        </div>
                        <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:bg-white/25 transition-all duration-500 group-hover:rotate-6">
                          <svg className="w-7 h-7 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                      <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                        Show highly rated offers (4+ stars)
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Filter Controls */}
              <div className="bg-gradient-to-r from-white/95 via-white/90 to-orange-50/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-orange-100/50 mb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">Advanced Search & Sort</span>
                    <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      💡 Tip: Click any active filter tag below to remove it instantly
                    </div>
                  </div>
                  {(filters.search || filters.availability !== 'all' || filters.rating !== 'all' || filters.sortBy !== 'newest') && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-orange-600 font-medium text-xs">Filters Active</span>
                      <span className="text-gray-500 text-xs">• Click tags below to remove</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Search Bar */}
                  <div className="flex-1 max-w-md relative">
                    <div className="relative group">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search by title or destination..."
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                        className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                      />
                      {filters.search && (
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                          <button
                            onClick={() => setFilters({...filters, search: ''})}
                            className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-lg transition-all duration-300 flex items-center justify-center group transform hover:scale-110"
                            title="Clear search"
                          >
                            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    {filters.search && (
                      <div className="absolute top-full left-0 mt-1 text-xs text-gray-500 flex items-center gap-2">
                        <span>💡 Searching in titles and destinations</span>
                      </div>
                    )}
                  </div>

                  {/* Secondary Filters */}
                  <div className="flex flex-wrap gap-3">
                    {/* Sort By */}
                    <div className="relative group">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                        className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800 font-medium appearance-none cursor-pointer pr-10"
                      >
                        <option value="newest">🕒 Newest First</option>
                        <option value="oldest">📅 Oldest First</option>
                        <option value="rating-high">🔥 Highest Rated</option>
                        <option value="rating-low">📈 Lowest Rated</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      
                      {/* Sort tooltip */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                          Choose how to sort the results
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>

                    {/* 5-Star Filter Button */}
                    <div className="relative group">
                      <button
                        onClick={() => setFilters({...filters, rating: filters.rating === '5' ? 'all' : '5'})}
                        className={`px-4 py-3 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 relative ${
                          filters.rating === '5'
                            ? 'bg-yellow-500 text-white shadow-lg ring-2 ring-yellow-200'
                            : 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-yellow-400'
                        }`}
                      >
                        ⭐ Perfect (5★)
                        {filters.rating === '5' && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-xs bg-white/20 px-1 rounded">Click to remove</span>
                          </div>
                        )}
                      </button>
                      
                      {/* 5-star tooltip */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                          {filters.rating === '5' ? 'Click to remove 5-star filter' : 'Show only perfect 5-star offers'}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <div className="relative group">
                      <button
                        onClick={resetFilters}
                        className="px-4 py-3 bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-700 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 transform hover:scale-105"
                      >
                        <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset All
                        <span className="text-xs bg-white/20 px-1 rounded group-hover:bg-black/20">Clear everything</span>
                      </button>
                      
                      {/* Reset tooltip */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                          Clear all filters and search instantly
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Summary with Enhanced UX */}
                {(filters.search || filters.availability !== 'all' || filters.rating !== 'all' || filters.sortBy !== 'newest') && (
                  <div className="mt-4 pt-4 border-t border-gray-200/50">
                    {/* Helpful tip above results */}
                    <div className="mb-3 flex items-center justify-center">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center gap-2 animate-pulse">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-blue-700 text-sm font-medium">💡 Click any filter below to remove it instantly</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="text-gray-600 text-sm">
                            Found <span className="font-bold text-orange-600 text-lg">{filteredOffers.length}</span> of <span className="font-bold">{offers.length}</span> offers
                          </span>
                        </div>
                        
                        {filteredOffers.length === 0 && (
                          <div className="flex items-center gap-2 text-amber-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-sm font-medium">No matches found</span>
                          </div>
                        )}
                      </div>

                      {/* Active Filter Tags - Fully Clickable */}
                      <div className="flex flex-wrap gap-2">
                        {filters.search && (
                          <button
                            onClick={() => setFilters({...filters, search: ''})}
                            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 hover:text-blue-900 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                            title="Click to remove search filter"
                          >
                            <span className="flex items-center gap-2">
                              🔍 {filters.search}
                              <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                            
                            {/* Animated border on hover */}
                            <div className="absolute inset-0 rounded-lg border-2 border-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        )}
                        
                        {filters.availability !== 'all' && (
                          <button
                            onClick={() => setFilters({...filters, availability: 'all'})}
                            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 hover:text-green-900 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                            title="Click to remove availability filter"
                          >
                            <span className="flex items-center gap-2">
                              {filters.availability === 'available' ? '✅ Available' : '❌ Sold Out'}
                              <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                            
                            {/* Animated border on hover */}
                            <div className="absolute inset-0 rounded-lg border-2 border-green-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        )}
                        
                        {filters.rating !== 'all' && (
                          <button
                            onClick={() => setFilters({...filters, rating: 'all'})}
                            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 hover:text-yellow-900 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                            title="Click to remove rating filter"
                          >
                            <span className="flex items-center gap-2">
                              ⭐ {filters.rating === '5' ? '5 Stars' : filters.rating === '4+' ? '4+ Stars' : '3+ Stars'}
                              <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                            
                            {/* Animated border on hover */}
                            <div className="absolute inset-0 rounded-lg border-2 border-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        )}
                        
                        {filters.sortBy !== 'newest' && (
                          <button
                            onClick={() => setFilters({...filters, sortBy: 'newest'})}
                            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 hover:text-purple-900 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                            title="Click to reset sort order"
                          >
                            <span className="flex items-center gap-2">
                              📊 {filters.sortBy === 'oldest' ? 'Oldest First' : filters.sortBy === 'rating-high' ? 'Highest Rated' : 'Lowest Rated'}
                              <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                            
                            {/* Animated border on hover */}
                            <div className="absolute inset-0 rounded-lg border-2 border-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Offers Grid */}
              <OffersGrid 
                offers={filteredOffers}
                onDelete={handleDeleteOffer}
                onToggleStatus={toggleOfferStatus}
              />
                </>
              )}
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
