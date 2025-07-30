import { OfferFormData } from '../validations/offer.validations';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreateOfferResponse {
    id: string;
    title: string;
    shortDescription: string;
    bigDescription: string;
    stars: number;
    duration: number;
    destination: string;
    mainImageUrl: string;
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ApiError {
    error: string;
    details?: string;
}

export const offerService = {
    /**
     * Create a new offer with images
     */
    async createOffer(
        offerData: OfferFormData,
        mainImage: File | null,
        additionalImages: File[]
    ): Promise<CreateOfferResponse> {
        try {
            // Create FormData for multipart/form-data request
            const formData = new FormData();

            // Add offer data
            formData.append('title', offerData.title);
            formData.append('shortDescription', offerData.shortDescription);
            formData.append('bigDescription', offerData.bigDescription);
            formData.append('stars', offerData.stars.toString());
            formData.append('duration', offerData.duration);
            formData.append('destination', offerData.destination);

            // Add main image if provided
            if (mainImage) {
                formData.append('mainImage', mainImage);
            }

            // Add additional images if provided
            if (additionalImages.length > 0) {
                additionalImages.forEach((file) => {
                    formData.append('images', file);
                });
            }

            const response = await fetch(`${API_BASE_URL}/offers`, {
                method: 'POST',
                credentials: 'include', // Include cookies for authentication
                body: formData, // Don't set Content-Type, let browser set it with boundary
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to create offer');
            }

            return await response.json();
        } catch (error) {
            console.error('Create offer failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to create offer');
        }
    },

    /**
     * Get all offers
     */
    async getOffers(): Promise<CreateOfferResponse[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/offers`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to fetch offers');
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch offers failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch offers');
        }
    },

    /**
     * Get offer by ID
     */
    async getOfferById(id: string): Promise<CreateOfferResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to fetch offer');
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch offer by ID failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch offer');
        }
    },

    /**
     * Update an existing offer with ultra-flexible image management
     * Perfectly matches your advanced backend capabilities:
     * - Remove main image: removeMainImage: true
     * - Remove specific gallery images: removeGalleryImages as JSON array
     * - Add to existing gallery: addToGallery: true
     * - Replace all gallery: replaceAllGallery: true
     */
    async updateOffer(
        id: string,
        offerData: Partial<OfferFormData & { destination: string }>,
        mainImage?: File | null,
        additionalImages?: File[],
        removeMainImage?: boolean,
        removeGalleryImages?: string[],
        addToGallery?: boolean,
        replaceAllGallery?: boolean
    ): Promise<CreateOfferResponse> {
        try {
            const formData = new FormData();

            // Add offer data (only non-empty fields)
            Object.entries(offerData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, value.toString());
                }
            });

            // Handle main image operations
            if (removeMainImage) {
                formData.append('removeMainImage', 'true');
            } else if (mainImage) {
                formData.append('mainImage', mainImage);
            }

            // Handle gallery image operations - match your backend's flexible parsing
            if (removeGalleryImages && removeGalleryImages.length > 0) {
                // Send as JSON string (your backend handles this perfectly)
                formData.append('removeGalleryImages', JSON.stringify(removeGalleryImages));
            }

            if (additionalImages && additionalImages.length > 0) {
                // Set operation flags to match your backend logic perfectly
                if (addToGallery) {
                    formData.append('addToGallery', 'true');
                } else if (replaceAllGallery) {
                    formData.append('replaceAllGallery', 'true');
                } else {
                    // Default behavior - replace all
                    formData.append('replaceAllGallery', 'true');
                }
                
                additionalImages.forEach((file) => {
                    formData.append('images', file);
                });
            }

            console.log('%cSending flexible image operations to your advanced backend:', 'color: green; font-weight: bold;', {
                id,
                hasMainImage: !!mainImage,
                removeMainImage: !!removeMainImage,
                additionalImagesCount: additionalImages?.length || 0,
                removeGalleryImages: removeGalleryImages?.length || 0,
                addToGallery: !!addToGallery,
                replaceAllGallery: !!replaceAllGallery,
                backendOperations: {
                    mainImageReplace: !!mainImage,
                    mainImageRemove: !!removeMainImage,
                    galleryAdd: !!addToGallery && additionalImages?.length,
                    galleryReplaceAll: !!replaceAllGallery && additionalImages?.length,
                    galleryRemoveSpecific: removeGalleryImages?.length
                }
            });

            const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to update offer');
            }

            return await response.json();
        } catch (error) {
            console.error('Update offer failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to update offer');
        }
    },

    /**
     * Delete an offer
     */
    async deleteOffer(id: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to delete offer');
            }
        } catch (error) {
            console.error('Delete offer failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to delete offer');
        }
    },

    /**
     * Toggle offer availability
     */
    async toggleOfferStatus(id: string, available: boolean): Promise<CreateOfferResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/offers/${id}/status`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ available }),
            });
            
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to toggle offer status');
            }

            return await response.json();
        } catch (error) {
            console.error('Toggle offer status failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to toggle offer status');
        }
    }
};
