// Shared types for offer components

// Frontend display types (for existing local data)
export interface Offer {
  id: string | number  // Support both string (backend) and number (local) IDs
  title: string
  destination: string
  duration: string
  image: string
  description: string
  shortDescription?: string
  rating: number
  available: boolean
  additionalImages?: string[]
  createdAt?: string  // Optional for backward compatibility with local data
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

// Backend API response types
export interface ApiOffer {
  id: string
  // Multilingual fields
  title_en?: string
  title_fr?: string
  destination_en?: string
  destination_fr?: string
  shortDescription_en?: string
  shortDescription_fr?: string
  bigDescription_en?: string
  bigDescription_fr?: string
  // Legacy single-language fields (for backward compatibility)
  title?: string
  destination?: string
  shortDescription?: string
  bigDescription?: string
  // Common fields
  stars: number
  duration: number
  mainImage: string // Changed from mainImageUrl to match backend
  images: string[] // Changed from imageUrls to match backend
  available?: boolean
  createdAt: string
  updatedAt: string
  currentLanguage?: string
  translations?: any
}

// Form data type for multilingual offers
export interface NewOffer {
  // English fields
  title_en: string
  destination_en: string
  shortDescription_en: string
  bigDescription_en: string
  // French fields
  title_fr: string
  destination_fr: string
  shortDescription_fr: string
  bigDescription_fr: string
  // Common fields
  duration: string
  stars: number
}

// Language type
export type Language = 'en' | 'fr'

// Validation errors type
export interface ValidationErrors {
  [key: string]: string[]
}

export type TabType = 'offers' | 'add-offer'

// Helper function to convert API offer to display offer with multilingual support
export const apiOfferToOffer = (apiOffer: ApiOffer, preferredLanguage: Language = 'en'): Offer => {
  // Ensure we have valid data with fallbacks
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZSBBdmFpbGFibGU8L3RleHQ+PC9zdmc+'
  
  // Function to get full image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl || imageUrl.trim() === '') return fallbackImage
    
    // If it's already a full URL (http/https) or data URL, return as is
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl
    }
    
    // If it's a relative path, prepend the backend server URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
    return `${backendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
  }

  // Get localized content based on preferred language
  const getLocalizedContent = () => {
    // Try to get content in preferred language first
    if (preferredLanguage === 'fr') {
      return {
        title: apiOffer.title_fr || apiOffer.title || 'Untitled Offer',
        destination: apiOffer.destination_fr || apiOffer.destination || 'Unknown Destination',
        shortDescription: apiOffer.shortDescription_fr || apiOffer.shortDescription || 'No short description available',
        bigDescription: apiOffer.bigDescription_fr || apiOffer.bigDescription || 'No description available'
      }
    } else {
      return {
        title: apiOffer.title_en || apiOffer.title || 'Untitled Offer',
        destination: apiOffer.destination_en || apiOffer.destination || 'Unknown Destination',
        shortDescription: apiOffer.shortDescription_en || apiOffer.shortDescription || 'No short description available',
        bigDescription: apiOffer.bigDescription_en || apiOffer.bigDescription || 'No description available'
      }
    }
  }

  const localizedContent = getLocalizedContent()
  
  return {
    id: apiOffer.id,  // Keep the original string ID from backend
    title: localizedContent.title,
    destination: localizedContent.destination,
    duration: apiOffer.duration?.toString() || '0',
    image: getImageUrl(apiOffer.mainImage), // Fixed: mainImageUrl -> mainImage
    description: localizedContent.bigDescription,
    shortDescription: localizedContent.shortDescription,
    rating: apiOffer.stars || 5,
    available: apiOffer.available ?? true,
    createdAt: apiOffer.createdAt,
    additionalImages: apiOffer.images?.map(getImageUrl) || [], // Fixed: imageUrls -> images
    currentLanguage: preferredLanguage,
    // Include all translations if available
    translations: apiOffer.translations || (apiOffer.title_en && apiOffer.title_fr ? {
      en: {
        title: apiOffer.title_en || apiOffer.title || '',
        shortDescription: apiOffer.shortDescription_en || apiOffer.shortDescription || '',
        bigDescription: apiOffer.bigDescription_en || apiOffer.bigDescription || '',
        destination: apiOffer.destination_en || apiOffer.destination || ''
      },
      fr: {
        title: apiOffer.title_fr || apiOffer.title || '',
        shortDescription: apiOffer.shortDescription_fr || apiOffer.shortDescription || '',
        bigDescription: apiOffer.bigDescription_fr || apiOffer.bigDescription || '',
        destination: apiOffer.destination_fr || apiOffer.destination || ''
      }
    } : undefined)
  }
}
