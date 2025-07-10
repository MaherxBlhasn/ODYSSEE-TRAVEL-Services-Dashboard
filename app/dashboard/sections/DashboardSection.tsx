import { Package, Eye, Globe, TrendingUp } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import { offers, contacts } from '../data'

export default function DashboardSection() {
  const stats = [
    { label: "Total Bookings", value: "1,234", change: "+12%", icon: <Package className="w-6 h-6 text-orange-600" /> },
    { label: "Website Visits", value: "45,678", change: "+8%", icon: <Eye className="w-6 h-6 text-orange-600" /> },
    { label: "Active Offers", value: offers.filter(o => o.available).length.toString(), change: "+2", icon: <Globe className="w-6 h-6 text-orange-600" /> },
    { label: "Revenue", value: "$89,456", change: "+15%", icon: <TrendingUp className="w-6 h-6 text-orange-600" /> }
  ]

  const topDestinations = [
    { country: "Greece", visits: 1234, flag: "🇬🇷" },
    { country: "Indonesia", visits: 987, flag: "🇮🇩" },
    { country: "Japan", visits: 856, flag: "🇯🇵" },
    { country: "France", visits: 743, flag: "🇫🇷" },
    { country: "Italy", visits: 692, flag: "🇮🇹" }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Top Destinations */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Destinations</h3>
        <div className="space-y-3">
          {topDestinations.map((dest, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{dest.flag}</span>
                <span className="font-medium text-gray-900">{dest.country}</span>
              </div>
              <span className="text-orange-600 font-semibold">{dest.visits.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Contacts</h3>
        <div className="space-y-3">
          {contacts.slice(0, 3).map(contact => (
            <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{contact.date}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  contact.status === 'new' ? 'bg-green-100 text-green-700' :
                  contact.status === 'replied' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {contact.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}