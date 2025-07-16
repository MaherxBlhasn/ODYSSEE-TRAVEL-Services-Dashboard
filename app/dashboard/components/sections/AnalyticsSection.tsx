import AnalyticsChart from '../AnalyticsChart'
import TrafficSource from '../TrafficSource'

export default function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Bookings</h3>
          <AnalyticsChart />
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            <TrafficSource source="Direct" percentage={45} color="bg-blue-500" />
            <TrafficSource source="Social Media" percentage={30} color="bg-green-500" />
            <TrafficSource source="Search Engines" percentage={20} color="bg-orange-500" />
            <TrafficSource source="Referrals" percentage={5} color="bg-purple-500" />
          </div>
        </div>
      </div>
    </div>
  )
}