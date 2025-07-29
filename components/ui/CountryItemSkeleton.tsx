import React from 'react'

const CountryItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
    </div>
    <div className="flex items-center space-x-2">
      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
      <div className="w-12 h-2 bg-gray-200 rounded-full animate-pulse"></div>
    </div>
  </div>
  )
}

export default CountryItemSkeleton