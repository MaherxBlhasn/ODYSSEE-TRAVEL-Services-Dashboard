'use client'

import { Plus, ArrowLeft } from 'lucide-react'
import { TabType, Language } from '../types'
import UltimateLanguageSelector from '../../UltimateLanguageSelector'

interface TabNavigationProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  selectedLanguage?: Language
  onLanguageChange?: (language: Language) => void
  showLanguageSelector?: boolean
}

export default function TabNavigation({ 
  activeTab, 
  setActiveTab, 
  selectedLanguage, 
  onLanguageChange, 
  showLanguageSelector = false 
}: TabNavigationProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section with buttons aligned */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {activeTab === 'add-offer' && (
            <button
              onClick={() => setActiveTab('offers')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {activeTab === 'offers' ? 'Travel Offers' : 'Add New Offer'}
            </h2>
            <p className="text-gray-600">
              {activeTab === 'offers'
                ? 'View and manage your travel offers'
                : 'Create a new travel offer'}
            </p>
          </div>
        </div>

        {/* Tab Buttons aligned to the right */}
        <div className="flex items-center gap-3">
          {/* Language Selector - Icon Only */}
          {showLanguageSelector && selectedLanguage && onLanguageChange && activeTab === 'offers' && (
            <UltimateLanguageSelector
              currentLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              showLabel={false}
              size="sm"
              iconOnly={true}
            />
          )}
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'offers'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
            >
              Travel Offers
            </button>
            <button
              onClick={() => setActiveTab('add-offer')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'add-offer'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
            >
              <Plus className="w-4 h-4" />
              Add Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



