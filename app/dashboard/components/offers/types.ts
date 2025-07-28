// Shared types for offer components

// Frontend display types (for existing local data)
export interface Offer {
  id: number
  title: string
  destination: string
  duration: string
  image: string
  description: string
  rating: number
  available: boolean
}

// Backend API response types
export interface ApiOffer {
  id: string
  title: string
  destination: string
  shortDescription: string
  bigDescription: string
  stars: number
  duration: number
  mainImageUrl: string
  imageUrls: string[]
  available?: boolean
  createdAt: string
  updatedAt: string
}

// Form data type
export interface NewOffer {
  title: string
  destination: string
  duration: string
  shortDescription: string
  bigDescription: string
  stars: number
}

// Validation errors type
export interface ValidationErrors {
  [key: string]: string[]
}

export type TabType = 'offers' | 'add-offer'

// Global counter for generating unique IDs
let idCounter = Date.now()

// Helper function to convert API offer to display offer
export const apiOfferToOffer = (apiOffer: ApiOffer): Offer => {
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
  
  // Generate unique ID - increment counter to avoid duplicates
  const generateUniqueId = (): number => {
    return ++idCounter
  }
  
  return {
    id: parseInt(apiOffer.id) || generateUniqueId(),
    title: apiOffer.title || 'Untitled Offer',
    destination: apiOffer.destination || 'Unknown Destination',
    duration: apiOffer.duration?.toString() || '0',
    image: getImageUrl(apiOffer.mainImageUrl),
    description: apiOffer.bigDescription || apiOffer.shortDescription || 'No description available',
    rating: apiOffer.stars || 5,
    available: apiOffer.available ?? true
  }
}
