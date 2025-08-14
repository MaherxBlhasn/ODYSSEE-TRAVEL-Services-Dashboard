import { z } from 'zod';

// Multilingual offer schema (primary)
export const multilingualOfferSchema = z.object({
  // English fields
  title_en: z.string()
    .min(1, 'English title is required')
    .min(3, 'English title must be at least 3 characters')
    .max(100, 'English title must be at most 100 characters'),
  
  shortDescription_en: z.string()
    .min(1, 'English short description is required')
    .min(10, 'English short description must be at least 10 characters')
    .max(250, 'English short description must be at most 250 characters'),
  
  bigDescription_en: z.string()
    .min(1, 'English detailed description is required')
    .min(50, 'English detailed description must be at least 50 characters')
    .max(2000, 'English detailed description must be at most 2000 characters'),
  
  destination_en: z.string()
    .min(1, 'English destination is required')
    .min(2, 'English destination must be at least 2 characters')
    .max(100, 'English destination must be at most 100 characters'),

  // French fields
  title_fr: z.string()
    .min(1, 'French title is required')
    .min(3, 'French title must be at least 3 characters')
    .max(100, 'French title must be at most 100 characters'),
  
  shortDescription_fr: z.string()
    .min(1, 'French short description is required')
    .min(10, 'French short description must be at least 10 characters')
    .max(250, 'French short description must be at most 250 characters'),
  
  bigDescription_fr: z.string()
    .min(1, 'French detailed description is required')
    .min(50, 'French detailed description must be at least 50 characters')
    .max(2000, 'French detailed description must be at most 2000 characters'),
  
  destination_fr: z.string()
    .min(1, 'French destination is required')
    .min(2, 'French destination must be at least 2 characters')
    .max(100, 'French destination must be at most 100 characters'),

  // Common fields
  stars: z.number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars')
    .int('Rating must be a whole number'),
  
  duration: z.string()
    .min(1, 'Duration is required')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) <= 365, {
      message: 'Duration must be a valid number between 1 and 365 days'
    }),
});

// Legacy single-language offer schema (for backward compatibility)
export const legacyOfferSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  
  shortDescription: z.string()
    .min(1, 'Short description is required')
    .min(10, 'Short description must be at least 10 characters')
    .max(250, 'Short description must be at most 250 characters'),
  
  bigDescription: z.string()
    .min(1, 'Detailed description is required')
    .min(50, 'Detailed description must be at least 50 characters')
    .max(2000, 'Detailed description must be at most 2000 characters'),
  
  stars: z.number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars')
    .int('Rating must be a whole number'),
  
  duration: z.string()
    .min(1, 'Duration is required')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) <= 365, {
      message: 'Duration must be a valid number between 1 and 365 days'
    }),
  
  destination: z.string()
    .min(1, 'Destination is required')
    .min(2, 'Destination must be at least 2 characters')
    .max(100, 'Destination must be at most 100 characters'),
});

// Use the multilingual schema as the main offer schema
export const offerSchema = multilingualOfferSchema;

// Schema for creating offer with images
export const createOfferSchema = offerSchema.extend({
  mainImage: z.unknown().optional(), // File validation will be handled separately
  additionalImages: z.array(z.unknown()).optional(),
});

// Type definitions
export type OfferFormData = z.infer<typeof legacyOfferSchema>; // Keep legacy for backward compatibility
export type MultilingualOfferFormData = z.infer<typeof multilingualOfferSchema>;
export type CreateOfferData = z.infer<typeof createOfferSchema>;

// Validation helper functions
export const validateOffer = (data: unknown) => {
  // Check if data has multilingual fields
  const hasMultilingualFields = data && typeof data === 'object' && (
    'title_en' in data || 'title_fr' in data ||
    'destination_en' in data || 'destination_fr' in data ||
    'shortDescription_en' in data || 'shortDescription_fr' in data ||
    'bigDescription_en' in data || 'bigDescription_fr' in data
  );
  
  if (hasMultilingualFields) {
    // Use multilingual schema for multilingual data
    return multilingualOfferSchema.safeParse(data);
  } else {
    // Use legacy schema for legacy data
    return legacyOfferSchema.safeParse(data);
  }
};

export const validateMultilingualOffer = (data: unknown) => {
  return multilingualOfferSchema.safeParse(data);
};

export const validateCreateOffer = (data: unknown) => {
  return createOfferSchema.safeParse(data);
};

// Image validation helper
export const validateImageFile = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size must be less than 10MB' };
  }
  
  return { isValid: true, error: null };
};

// Multiple images validation
export const validateImages = (files: File[]) => {
  const errors: string[] = [];
  
  if (files.length > 10) {
    errors.push('Maximum 10 additional images allowed');
  }
  
  files.forEach((file, index) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      errors.push(`Image ${index + 1}: ${validation.error}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
