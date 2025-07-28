import { z } from 'zod';

// Base offer schema for validation
export const offerSchema = z.object({
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
  
  price: z.string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Price must be a valid positive number'
    }),
  
  duration: z.string()
    .min(1, 'Duration is required')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: 'Duration must be a valid positive number (in days)'
    }),
  
  destination: z.string()
    .min(1, 'Destination is required')
    .min(2, 'Destination must be at least 2 characters')
    .max(100, 'Destination must be at most 100 characters'),
});

// Schema for creating offer with images
export const createOfferSchema = offerSchema.extend({
  mainImage: z.any().optional(), // File validation will be handled separately
  additionalImages: z.array(z.any()).optional(),
});

// Type definitions
export type OfferFormData = z.infer<typeof offerSchema>;
export type CreateOfferData = z.infer<typeof createOfferSchema>;

// Validation helper functions
export const validateOffer = (data: any) => {
  return offerSchema.safeParse(data);
};

export const validateCreateOffer = (data: any) => {
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
