import { ReactNode } from 'react'

interface StatsCardProps {
  label: string
  value: string
  change: string
  icon: ReactNode
}

export default function StatsCard({ label, value, change, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-green-600 mt-1">↗ {change}</p>
        </div>
        <div className="bg-orange-100 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  )
}