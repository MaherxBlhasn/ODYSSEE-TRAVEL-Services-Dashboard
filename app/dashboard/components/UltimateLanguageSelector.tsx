'use client'

import { useState } from 'react'
import { ChevronDown, Globe, Check } from 'lucide-react'

export type Language = 'en' | 'fr'

interface LanguageSelectorProps {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  iconOnly?: boolean
}

// High-quality SVG Flag Components
const USFlag = ({ className = "" }: { className?: string }) => (
  <svg className={`w-6 h-4 rounded-sm ${className}`} viewBox="0 0 24 16" fill="none">
    <rect width="24" height="16" fill="#B22234"/>
    <rect width="24" height="1.23" y="1.23" fill="white"/>
    <rect width="24" height="1.23" y="3.69" fill="white"/>
    <rect width="24" height="1.23" y="6.15" fill="white"/>
    <rect width="24" height="1.23" y="8.62" fill="white"/>
    <rect width="24" height="1.23" y="11.08" fill="white"/>
    <rect width="24" height="1.23" y="13.54" fill="white"/>
    <rect width="9.6" height="8.61" fill="#3C3B6E"/>
  </svg>
)

const FranceFlag = ({ className = "" }: { className?: string }) => (
  <svg className={`w-6 h-4 rounded-sm ${className}`} viewBox="0 0 24 16" fill="none">
    <rect width="8" height="16" fill="#002395"/>
    <rect x="8" width="8" height="16" fill="white"/>
    <rect x="16" width="8" height="16" fill="#ED2939"/>
  </svg>
)

const languageOptions = [
  { 
    code: 'en' as Language, 
    name: 'English', 
    nativeName: 'English',
    flag: USFlag,
    shortCode: 'EN'
  },
  { 
    code: 'fr' as Language, 
    name: 'French', 
    nativeName: 'Français',
    flag: FranceFlag,
    shortCode: 'FR'
  }
]

export default function UltimateLanguageSelector({ 
  currentLanguage, 
  onLanguageChange, 
  className = '',
  showLabel = true,
  size = 'md',
  iconOnly = false
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const currentOption = languageOptions.find(option => option.code === currentLanguage)
  const CurrentFlag = currentOption?.flag
  
  const sizeClasses = {
    sm: 'text-sm h-8 px-2',
    md: 'text-sm h-10 px-3',
    lg: 'text-base h-12 px-4'
  }

  return (
    <div className={`relative ${className}`}>
      {showLabel && !iconOnly && (
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Globe className="w-4 h-4" />
          Language
        </label>
      )}
      
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            ${sizeClasses[size]}
            bg-white border border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100
            rounded-lg transition-all duration-200 flex items-center gap-2.5 font-medium text-gray-700 hover:text-gray-900
            shadow-sm hover:shadow-md focus:outline-none group
            ${iconOnly ? 'justify-center min-w-[48px]' : 'justify-between min-w-[120px]'}
          `}
          aria-label={`Current language: ${currentOption?.name}`}
          type="button"
        >
          <div className="flex items-center gap-2.5">
            {CurrentFlag && <CurrentFlag className="shadow-sm border border-gray-200" />}
            {!iconOnly && (
              <span className="font-semibold text-gray-800 tracking-wide">{currentOption?.shortCode}</span>
            )}
          </div>
          {!iconOnly && (
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-500 group-hover:text-gray-700`} 
            />
          )}
        </button>

        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
        )}
        
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden min-w-[220px] animate-in slide-in-from-top-2 duration-200">
            <div className="py-2">
              {languageOptions.map((option) => {
                const OptionFlag = option.flag
                return (
                  <button
                    key={option.code}
                    onClick={() => {
                      onLanguageChange(option.code)
                      setIsOpen(false)
                    }}
                    className={`
                      w-full px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-all duration-150 text-left group
                      ${currentLanguage === option.code 
                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500' 
                        : 'text-gray-700 hover:text-gray-900'
                      }
                    `}
                    type="button"
                  >
                    <OptionFlag className="shadow-sm border border-gray-200 group-hover:shadow-md transition-shadow" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm tracking-wide">{option.shortCode}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm font-medium">{option.nativeName}</span>
                      </div>
                    </div>
                    {currentLanguage === option.code && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                )
              })}
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-100 px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50">
              <p className="text-xs text-gray-600 flex items-center gap-2 font-medium">
                <Globe className="w-3.5 h-3.5" />
                Select your preferred language
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Tooltip for icon-only mode */}
        {iconOnly && (
          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30">
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2.5 whitespace-nowrap shadow-lg border border-gray-700">
              <div className="flex items-center gap-2.5">
                {CurrentFlag && <CurrentFlag className="shadow-sm" />}
                <span className="font-medium">{currentOption?.nativeName}</span>
              </div>
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
