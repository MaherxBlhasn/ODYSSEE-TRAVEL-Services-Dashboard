'use client';
import React from 'react';

interface ChartSkeletonProps {
  height?: string;
}

const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ height = 'h-80' }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
    <div className={`${height} bg-gray-100 rounded-lg animate-pulse`}></div>
  </div>
);

export default ChartSkeleton;
