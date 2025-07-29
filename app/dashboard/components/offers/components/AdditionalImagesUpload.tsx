'use client'

import { useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
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
  const [isUploading, setIsUploading] = useState(false)

  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setIsUploading(true)
      try {
        const fileArray = Array.from(files)
        
        // Read all files using Promise.all to handle them properly
        const filePromises = fileArray.map(file => {
          return new Promise<string>((resolve, reject) => {
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
        })
        
        // Wait for all files to be processed
        const newImages = await Promise.all(filePromises)
        
        // Update state with all new images at once
        setAdditionalImages([...additionalImages, ...newImages])
        
        // Reset the input value to allow selecting the same files again if needed
        if (e.target) {
          e.target.value = ''
        }
      } catch (error) {
        console.error('Error processing files:', error)
        // You could add error handling here, maybe show a toast or error message
      } finally {
        setIsUploading(false)
      }
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
        onClick={() => !isUploading && additionalImagesInputRef.current?.click()}
        className={`border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 ${
          isUploading 
            ? 'cursor-not-allowed bg-gray-50' 
            : 'hover:border-orange-400 hover:bg-orange-50 cursor-pointer'
        } group`}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-6 h-6 text-orange-500 mx-auto mb-2 animate-spin" />
            <p className="text-orange-600 font-medium text-sm">
              Processing images...
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Please wait while we process your files
            </p>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-gray-400 group-hover:text-orange-500 mx-auto mb-2 transition-colors" />
            <p className="text-gray-600 group-hover:text-orange-600 font-medium text-sm">
              Upload additional images
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG (Multiple files)
            </p>
          </>
        )}
      </div>
      
      <input
        ref={additionalImagesInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleAdditionalImagesUpload}
        disabled={isUploading}
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
