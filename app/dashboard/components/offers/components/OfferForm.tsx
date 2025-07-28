'use client'

import { Plus } from 'lucide-react'
import { NewOffer, ValidationErrors } from '../types'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string[]
  children: React.ReactNode
}

const FormField = ({ label, required = false, error, children }: FormFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && error.length > 0 && (
        <div className="mt-2 space-y-1">
          {error.map((err, index) => (
            <p key={index} className="text-sm text-red-600 flex items-center gap-1">
              <span className="text-red-500">•</span>
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

interface OfferFormProps {
  newOffer: NewOffer
  setNewOffer: (offer: NewOffer) => void
  onSubmit: () => void
  onCancel: () => void
  isLoading?: boolean
  validationErrors?: ValidationErrors
}

export default function OfferForm({ 
  newOffer, 
  setNewOffer, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  validationErrors = {}
}: OfferFormProps) {
  const getInputClassName = (fieldName: string) => {
    const hasError = validationErrors[fieldName] && validationErrors[fieldName].length > 0
    return `w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
      hasError 
        ? 'border-red-300 focus:border-red-500' 
        : 'border-gray-200 focus:border-orange-500'
    }`
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-orange-600" />
        Offer Details
      </h3>
      
      <div className="space-y-6">
        {/* Title & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Offer Title" required error={validationErrors.title}>
            <input
              type="text"
              placeholder="e.g., Tropical Paradise Getaway"
              value={newOffer.title}
              onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
              className={getInputClassName('title')}
              disabled={isLoading}
            />
          </FormField>
          
          <FormField label="Destination" required error={validationErrors.destination}>
            <input
              type="text"
              placeholder="e.g., Bali, Indonesia"
              value={newOffer.destination}
              onChange={(e) => setNewOffer({...newOffer, destination: e.target.value})}
              className={getInputClassName('destination')}
              disabled={isLoading}
            />
          </FormField>
        </div>
        
        {/* Duration */}
        <div className="max-w-md">
          <FormField label="Duration" required error={validationErrors.duration}>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="365"
                placeholder="7"
                value={newOffer.duration}
                onChange={(e) => setNewOffer({...newOffer, duration: e.target.value})}
                className={`${getInputClassName('duration')} pr-16`}
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="text-gray-500 text-sm font-medium bg-gray-50 px-2 py-1 rounded-md border">
                  days
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Enter the number of days for this travel offer
            </p>
          </FormField>
        </div>

        {/* Short Description */}
        <FormField label="Short Description" required error={validationErrors.shortDescription}>
          <textarea
            placeholder="Brief description that appears in the offer card..."
            value={newOffer.shortDescription}
            onChange={(e) => setNewOffer({...newOffer, shortDescription: e.target.value})}
            className={getInputClassName('shortDescription')}
            rows={3}
            disabled={isLoading}
          />
        </FormField>

        {/* Big Description */}
        <FormField label="Detailed Description" required error={validationErrors.bigDescription}>
          <textarea
            placeholder="Detailed description with all the information about the offer..."
            value={newOffer.bigDescription}
            onChange={(e) => setNewOffer({...newOffer, bigDescription: e.target.value})}
            className={getInputClassName('bigDescription')}
            rows={6}
            disabled={isLoading}
          />
        </FormField>

        {/* Stars Rating */}
        <FormField label="Rating" required error={validationErrors.stars}>
          <div className="flex items-center gap-2">
            <select
              value={newOffer.stars}
              onChange={(e) => setNewOffer({...newOffer, stars: parseInt(e.target.value)})}
              className={getInputClassName('stars')}
              disabled={isLoading}
            >
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
            <div className="flex text-yellow-400">
              {[...Array(newOffer.stars)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </div>
        </FormField>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Offer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
