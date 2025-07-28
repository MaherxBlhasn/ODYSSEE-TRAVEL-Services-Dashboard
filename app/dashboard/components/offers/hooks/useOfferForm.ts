'use client'

import { useState } from 'react'
import { validateOffer, validateImageFile, validateImages } from '../../../../../lib/validations/offer.validations'
import { offerService } from '../../../../../lib/services/offer.service'
import { NewOffer, ValidationErrors } from '../types'

interface UseOfferFormProps {
  onSuccess: () => void
  onError: (error: string) => void
}

export const useOfferForm = ({ onSuccess, onError }: UseOfferFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const validateForm = (
    formData: NewOffer,
    mainImage: string | File | null,
    additionalImages: (string | File)[]
  ) => {
    const errors: ValidationErrors = {}

    // Validate form data
    const formValidation = validateOffer(formData)
    if (!formValidation.success) {
      formValidation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        if (!errors[field]) errors[field] = []
        errors[field].push(issue.message)
      })
    }

    // Validate main image if it's a file
    if (mainImage instanceof File) {
      const imageValidation = validateImageFile(mainImage)
      if (!imageValidation.isValid) {
        errors.mainImage = [imageValidation.error!]
      }
    }

    // Validate additional images if they're files
    const fileImages = additionalImages.filter(img => img instanceof File) as File[]
    if (fileImages.length > 0) {
      const imagesValidation = validateImages(fileImages)
      if (!imagesValidation.isValid) {
        errors.additionalImages = imagesValidation.errors
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const convertToFiles = async (images: (string | File)[]): Promise<File[]> => {
    const files: File[] = []
    
    for (const image of images) {
      if (image instanceof File) {
        files.push(image)
      } else if (typeof image === 'string' && image.startsWith('data:')) {
        // Convert base64 to File
        try {
          const response = await fetch(image)
          const blob = await response.blob()
          const file = new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' })
          files.push(file)
        } catch (error) {
          console.warn('Failed to convert base64 to file:', error)
        }
      }
    }
    
    return files
  }

  const submitOffer = async (
    formData: NewOffer,
    mainImage: string | File | null,
    additionalImages: (string | File)[]
  ) => {
    setIsLoading(true)
    setValidationErrors({})

    try {
      // Validate form
      if (!validateForm(formData, mainImage, additionalImages)) {
        setIsLoading(false)
        return
      }

      // Convert images to files
      let mainImageFile: File | null = null
      if (mainImage instanceof File) {
        mainImageFile = mainImage
      } else if (typeof mainImage === 'string' && mainImage.startsWith('data:')) {
        try {
          const response = await fetch(mainImage)
          const blob = await response.blob()
          mainImageFile = new File([blob], `main-image-${Date.now()}.jpg`, { type: 'image/jpeg' })
        } catch (error) {
          console.warn('Failed to convert main image:', error)
        }
      }

      const additionalImageFiles = await convertToFiles(additionalImages)

      // Submit to backend
      await offerService.createOffer(
        formData,
        mainImageFile,
        additionalImageFiles
      )

      onSuccess()
    } catch (error) {
      console.error('Failed to create offer:', error)
      onError(error instanceof Error ? error.message : 'Failed to create offer')
    } finally {
      setIsLoading(false)
    }
  }

  const clearValidationErrors = () => {
    setValidationErrors({})
  }

  return {
    isLoading,
    validationErrors,
    submitOffer,
    clearValidationErrors
  }
}
