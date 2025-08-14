'use client'

import { Plus, Globe, Languages } from 'lucide-react'
import { NewOffer, ValidationErrors, Language } from '../types'
import { useState } from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string[]
  children: React.ReactNode
  language?: string
}

const FormField = ({ label, required = false, error, children, language }: FormFieldProps) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
        {language && (
          <span className={`text-xs px-2 py-1 rounded-full font-normal ${
            language === 'en' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
          }`}>
            {language === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
          </span>
        )}
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

interface LanguageTabsProps {
  activeLanguage: Language
  setActiveLanguage: (lang: Language) => void
}

const LanguageTabs = ({ activeLanguage, setActiveLanguage }: LanguageTabsProps) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Languages className="w-5 h-5 text-gray-600" />
      <span className="text-sm font-medium text-gray-600">Language:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveLanguage('en')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            activeLanguage === 'en'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => setActiveLanguage('fr')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            activeLanguage === 'fr'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          🇫🇷 Français
        </button>
      </div>
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
  const [activeLanguage, setActiveLanguage] = useState<Language>('en')

  const getInputClassName = (fieldName: string) => {
    const hasError = validationErrors[fieldName] && validationErrors[fieldName].length > 0
    return `w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
      hasError 
        ? 'border-red-300 focus:border-red-500' 
        : 'border-gray-200 focus:border-orange-500'
    }`
  }

  // Helper function to get current language fields
  const getCurrentLanguageFields = () => {
    if (activeLanguage === 'en') {
      return {
        title: newOffer.title_en,
        destination: newOffer.destination_en,
        shortDescription: newOffer.shortDescription_en,
        bigDescription: newOffer.bigDescription_en
      }
    } else {
      return {
        title: newOffer.title_fr,
        destination: newOffer.destination_fr,
        shortDescription: newOffer.shortDescription_fr,
        bigDescription: newOffer.bigDescription_fr
      }
    }
  }

  // Helper function to update current language fields
  const updateLanguageField = (field: string, value: string) => {
    const fieldName = `${field}_${activeLanguage}` as keyof NewOffer
    setNewOffer({
      ...newOffer,
      [fieldName]: value
    })
  }

  const currentFields = getCurrentLanguageFields()

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-orange-600" />
        Create Multilingual Offer
        <Globe className="w-5 h-5 text-gray-400" />
      </h3>

      {/* Language Tabs */}
      <LanguageTabs activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />
      
      <div className="space-y-6">
        {/* Title & Destination for Current Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="Offer Title" 
            required 
            error={validationErrors[`title_${activeLanguage}`]}
            language={activeLanguage}
          >
            <input
              type="text"
              placeholder={activeLanguage === 'en' ? "e.g., Tropical Paradise Getaway" : "ex., Escapade Paradis Tropical"}
              value={currentFields.title}
              onChange={(e) => updateLanguageField('title', e.target.value)}
              className={getInputClassName(`title_${activeLanguage}`)}
              disabled={isLoading}
            />
          </FormField>
          
          <FormField 
            label="Destination" 
            required 
            error={validationErrors[`destination_${activeLanguage}`]}
            language={activeLanguage}
          >
            <input
              type="text"
              placeholder={activeLanguage === 'en' ? "e.g., Bali, Indonesia" : "ex., Bali, Indonésie"}
              value={currentFields.destination}
              onChange={(e) => updateLanguageField('destination', e.target.value)}
              className={getInputClassName(`destination_${activeLanguage}`)}
              disabled={isLoading}
            />
          </FormField>
        </div>

        {/* Duration and Stars (Common fields) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <FormField label="Rating" required error={validationErrors.stars}>
            <div className="flex items-center gap-4">
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
              <div className="flex text-yellow-400 text-lg">
                {[...Array(newOffer.stars)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>
          </FormField>
        </div>
        
        {/* Short Description for Current Language */}
        <FormField 
          label="Short Description" 
          required 
          error={validationErrors[`shortDescription_${activeLanguage}`]}
          language={activeLanguage}
        >
          <textarea
            placeholder={activeLanguage === 'en' ? "Brief description that appears in the offer card..." : "Brève description qui apparaît dans la carte d'offre..."}
            value={currentFields.shortDescription}
            onChange={(e) => updateLanguageField('shortDescription', e.target.value)}
            className={getInputClassName(`shortDescription_${activeLanguage}`)}
            rows={3}
            disabled={isLoading}
          />
        </FormField>

        {/* Big Description for Current Language */}
        <FormField 
          label="Detailed Description" 
          required 
          error={validationErrors[`bigDescription_${activeLanguage}`]}
          language={activeLanguage}
        >
          <textarea
            placeholder={activeLanguage === 'en' ? "Detailed description with all the information about the offer..." : "Description détaillée avec toutes les informations sur l'offre..."}
            value={currentFields.bigDescription}
            onChange={(e) => updateLanguageField('bigDescription', e.target.value)}
            className={getInputClassName(`bigDescription_${activeLanguage}`)}
            rows={6}
            disabled={isLoading}
          />
        </FormField>

        {/* Progress Indicator */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Translation Progress</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-700">🇬🇧 English:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(
                      (newOffer.title_en ? 25 : 0) +
                      (newOffer.destination_en ? 25 : 0) +
                      (newOffer.shortDescription_en ? 25 : 0) +
                      (newOffer.bigDescription_en ? 25 : 0)
                    )}%` 
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-600">
                {Math.round((
                  (newOffer.title_en ? 25 : 0) +
                  (newOffer.destination_en ? 25 : 0) +
                  (newOffer.shortDescription_en ? 25 : 0) +
                  (newOffer.bigDescription_en ? 25 : 0)
                ))}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-green-700">🇫🇷 Français:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(
                      (newOffer.title_fr ? 25 : 0) +
                      (newOffer.destination_fr ? 25 : 0) +
                      (newOffer.shortDescription_fr ? 25 : 0) +
                      (newOffer.bigDescription_fr ? 25 : 0)
                    )}%` 
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-600">
                {Math.round((
                  (newOffer.title_fr ? 25 : 0) +
                  (newOffer.destination_fr ? 25 : 0) +
                  (newOffer.shortDescription_fr ? 25 : 0) +
                  (newOffer.bigDescription_fr ? 25 : 0)
                ))}%
              </span>
            </div>
          </div>
        </div>

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
                <Globe className="w-4 h-4" />
                Create Multilingual Offer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
