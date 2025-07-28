'use client'

import { Plus, ArrowLeft } from 'lucide-react'
import { TabType } from '../types'

interface TabNavigationProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {activeTab === 'add-offer' && (
          <button
            onClick={() => setActiveTab('offers')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-2xl font-bold text-gray-900">
          {activeTab === 'offers' ? 'Travel Offers' : 'Add New Offer'}
        </h2>
      </div>
      
      {/* Tab Buttons */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'offers'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          Travel Offers
        </button>
        <button
          onClick={() => setActiveTab('add-offer')}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'add-offer'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Offer
        </button>
      </div>
    </div>
  )
}
