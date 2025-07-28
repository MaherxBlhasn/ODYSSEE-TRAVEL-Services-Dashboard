'use client'

import { useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import ImageWithFallback from '../../../../../components/ui/ImageWithFallback'

interface MainImageUploadProps {
  mainImage: string
  setMainImage: (image: string) => void
  validationError?: string
}

export default function MainImageUpload({ mainImage, setMainImage, validationError }: MainImageUploadProps) {
  const mainImageInputRef = useRef<HTMLInputElement>(null)

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setMainImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
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
          onClick={() => mainImageInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 cursor-pointer group"
        >
          <Upload className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-3 transition-colors" />
          <p className="text-gray-600 group-hover:text-orange-600 font-medium">
            Upload main image
          </p>
          <p className="text-sm text-gray-400 mt-1">
            PNG, JPG up to 10MB
          </p>
        </div>
      )}
      
      <input
        ref={mainImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleMainImageUpload}
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
