'use client'

import {
  Home,
  Package,
  Mail,
  BarChart3,
  LogOut,
  User,
  Menu,
  X,
  Newspaper,
  Database
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth.service'
import { dbUsageService, DbUsageResponse } from '@/lib/services/dbUsage.service'
import { useTransition, useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'

const sidebarItems = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'offers', label: 'Offers', icon: Package },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'contacts', label: 'Contacts', icon: Mail },
  { id: 'users', label: 'Users', icon: User },
  { id: 'newsletter', label: 'Newsletter', icon: Newspaper }
]

// Generate a consistent avatar based on username
const generateAvatar = (username: string) => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
  ]
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dbUsage, setDbUsage] = useState<{ size: number; percentage: number } | null>(null)
  const [isLoadingDbUsage, setIsLoadingDbUsage] = useState(false)

  const { user } = useAuth()

  // This would typically come from your auth context or user state
  const currentUser = user;

  const activeTab = pathname.split('/').pop() || 'dashboard'
  const avatarColor = currentUser ? generateAvatar(currentUser.username) : 'bg-gray-500'
  const userInitials = currentUser ? currentUser.username.split(' ').map(name => name[0]).join('').toUpperCase() : ''

  // Fetch database usage function
  const fetchDbUsage = async () => {
    try {
      setIsLoadingDbUsage(true)
      const response = await dbUsageService.getDbUsage()

      if (response.success) {
        // Parse the size from string format "XX.XX MB" to number
        const sizeInMB = parseFloat(response.db_size.replace(' MB', ''))
        const maxSize = 500 // 500MB limit
        const percentage = Math.min((sizeInMB / maxSize) * 100, 100)

        setDbUsage({
          size: sizeInMB,
          percentage: percentage
        })
      }
    } catch (error) {
      console.error('Failed to fetch database usage:', error)
      // Set fallback values or handle error state
      setDbUsage(null)
    } finally {
      setIsLoadingDbUsage(false)
    }
  }

  // List of dashboard routes that should trigger DB usage refresh
  const dbUsageRoutes = [
    '/dashboard/offers',
    '/dashboard/users',
    '/dashboard/contacts',
    '/dashboard/newsletter'
  ]

  // Initial fetch on component mount
  useEffect(() => {
    fetchDbUsage()
  }, [])

  // Refresh database usage only when navigating to specific dashboard pages
  useEffect(() => {
    const shouldRefresh = dbUsageRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    )

    if (shouldRefresh) {
      fetchDbUsage()
    }
  }, [pathname])

  const handleLogout = async () => {
    try {
      setMobileMenuOpen(false) // Close mobile menu if open
      await authService.logout()
      startTransition(() => {
        router.push('/login')
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const DatabaseUsageSection = () => (
    <div className="px-4 py-3 border-t border-slate-700">
      <div className="px-4 py-3 rounded-lg bg-slate-700/30">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-green-400" />
          <span className="text-stone-300 text-sm font-medium">Database Usage</span>
        </div>

        {isLoadingDbUsage ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-400 border-t-transparent"></div>
            <span className="text-stone-400 text-xs">Loading...</span>
          </div>
        ) : dbUsage ? (
          <div className="space-y-2">
            {/* Progress Bar */}
            <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${dbUsage.percentage}%` }}
              ></div>
            </div>

            {/* Usage Text */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400">
                {dbUsage.size.toFixed(2)} MB / 500 MB
              </span>
              <span className={`font-semibold ${dbUsage.percentage > 90
                  ? 'text-red-400'
                  : dbUsage.percentage > 70
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}>
                {dbUsage.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="text-stone-400 text-xs">
            Unable to load usage data
          </div>
        )}
      </div>
    </div>
  )

  const ProfileSection = () => (
    <div className="px-4 py-4 border-t border-slate-700">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700/50">
        <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm shadow-lg`}>
          {userInitials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-stone-200 font-medium text-sm truncate">
            {currentUser?.username}
          </p>
          <p className="text-stone-400 text-xs truncate">
            {currentUser?.Email}
          </p>
        </div>
        {/* Logout Button */}
        <div className="relative group">
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="p-2 rounded-lg text-stone-400 hover:text-red-400 hover:bg-slate-600/50 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg">
            {isPending ? 'Logging out...' : 'Logout'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-800 shadow-lg">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-stone-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-stone-200">ODYSSEE</h1>
            <p className="text-orange-400 text-xs">TRAVEL SERVICE</p>
          </div>
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-slate-900 border-b border-slate-700">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-stone-200">ODYSSEE</h1>
              <p className="text-orange-400 text-sm">TRAVEL SERVICE</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map(item => (
              <Link
                key={item.id}
                href={`/dashboard/${item.id}`}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-stone-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Database Usage Section */}
          <DatabaseUsageSection />

          {/* Profile Section */}
          <ProfileSection />
        </div>
      </div>

      {/* Mobile Sidebar - Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative z-50 w-64 h-full bg-slate-800 shadow-lg">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center h-16 bg-slate-900 border-b border-slate-700">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-stone-200">ODYSSEE</h1>
                  <p className="text-orange-400 text-sm">TRAVEL SERVICE</p>
                </div>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {sidebarItems.map(item => (
                  <Link
                    key={item.id}
                    href={`/dashboard/${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'text-stone-300 hover:bg-slate-700 hover:text-white'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Database Usage Section for Mobile */}
              <DatabaseUsageSection />

              {/* Profile Section for Mobile */}
              <ProfileSection />
            </div>
          </div>
        </div>
      )}
    </>
  )
}