import React from 'react'

const MetricCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
        <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
  </div>
  )
}

export default MetricCardSkeleton