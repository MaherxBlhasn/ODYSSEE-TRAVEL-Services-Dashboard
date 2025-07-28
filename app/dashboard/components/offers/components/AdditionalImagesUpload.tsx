'use client'

import { useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import ImageWithFallback from '../../../../../components/ui/ImageWithFallback'

interface AdditionalImagesUploadProps {
  additionalImages: string[]
  setAdditionalImages: (images: string[]) => void
  validationErrors?: string[]
}

export default function AdditionalImagesUpload({ 
  additionalImages, 
  setAdditionalImages, 
  validationErrors = [] 
}: AdditionalImagesUploadProps) {
  const additionalImagesInputRef = useRef<HTMLInputElement>(null)

  const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setAdditionalImages([...additionalImages, event.target.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-orange-600" />
        Additional Images
      </h3>
      
      {/* Upload Area */}
      <div 
        onClick={() => additionalImagesInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 cursor-pointer group"
      >
        <Upload className="w-6 h-6 text-gray-400 group-hover:text-orange-500 mx-auto mb-2 transition-colors" />
        <p className="text-gray-600 group-hover:text-orange-600 font-medium text-sm">
          Upload additional images
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PNG, JPG (Multiple files)
        </p>
      </div>
      
      <input
        ref={additionalImagesInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleAdditionalImagesUpload}
        className="hidden"
      />
      
      {/* Additional Images Gallery */}
      {additionalImages.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Additional Images ({additionalImages.length})
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {additionalImages.map((image, index) => (
              <div key={index} className="relative group">
                <ImageWithFallback
                  src={image}
                  alt={`Additional ${index + 1}`}
                  width={400}
                  height={80}
                  className="w-full h-20 object-cover rounded-lg border-2 border-gray-200 group-hover:border-orange-400 transition-colors"
                />
                <button
                  onClick={() => removeAdditionalImage(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Validation Errors */}
      {validationErrors && validationErrors.length > 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="space-y-1">
            {validationErrors.map((error, index) => (
              <p key={index} className="text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">•</span>
                {error}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
