'use client'

import { useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import ImageWithFallback from '../../../../../components/ui/ImageWithFallback'

interface MainImageUploadProps {
  mainImage: string
  setMainImage: (image: string) => void
  validationError?: string
}

export default function MainImageUpload({ mainImage, setMainImage, validationError }: MainImageUploadProps) {
  const mainImageInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const result = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as string)
            } else {
              reject(new Error('Failed to read file'))
            }
          }
          reader.onerror = () => reject(new Error('File reading failed'))
          reader.readAsDataURL(file)
        })
        
        setMainImage(result)
        
        // Reset the input value to allow selecting the same file again if needed
        if (e.target) {
          e.target.value = ''
        }
      } catch (error) {
        console.error('Error processing main image:', error)
        // You could add error handling here, maybe show a toast or error message
      } finally {
        setIsUploading(false)
      }
    }
  }

  const removeMainImage = () => {
    setMainImage('')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-orange-600" />
        Main Image
      </h3>
      
      {mainImage ? (
        <div className="relative">
          <ImageWithFallback
            src={mainImage}
            alt="Main offer image"
            width={400}
            height={192}
            className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
          />
          <button
            onClick={removeMainImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 bg-orange-600 text-white text-sm px-3 py-1 rounded-lg font-medium">
            Main Image
          </div>
        </div>
      ) : (
        <div 
          onClick={() => !isUploading && mainImageInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-200 ${
            isUploading 
              ? 'cursor-not-allowed bg-gray-50' 
              : 'hover:border-orange-400 hover:bg-orange-50 cursor-pointer'
          } group`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-orange-500 mx-auto mb-3 animate-spin" />
              <p className="text-orange-600 font-medium">
                Processing image...
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Please wait while we process your file
              </p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-3 transition-colors" />
              <p className="text-gray-600 group-hover:text-orange-600 font-medium">
                Upload main image
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PNG, JPG up to 10MB
              </p>
            </>
          )}
        </div>
      )}
      
      <input
        ref={mainImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleMainImageUpload}
        disabled={isUploading}
        className="hidden"
      />
      {/* Validation Error */}
      {validationError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span className="text-red-500">•</span>
            {validationError}
          </p>
        </div>
      )}
    </div>
  )
}
