'use client'

import {
  Home,
  Package,
  Mail,
  BarChart3,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth.service'
import { useTransition, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'

const sidebarItems = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'offers', label: 'Offers', icon: Package },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'contacts', label: 'Contacts', icon: Mail },
  { id: 'users', label: 'Users', icon: User },
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
  
  const { user } = useAuth()


  // This would typically come from your auth context or user state
  const currentUser = user;

  const activeTab = pathname.split('/').pop() || 'dashboard'
  const avatarColor = currentUser ? generateAvatar(currentUser.username) : 'bg-gray-500'
  const userInitials = currentUser ? currentUser.username.split(' ').map(name => name[0]).join('').toUpperCase() : ''

  const handleLogout = async () => {
    try {
      await authService.logout()
      startTransition(() => {
        router.push('/login')
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-stone-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-stone-300 hover:bg-slate-700 hover:text-white`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">
                {isPending ? 'Logging out...' : 'Logout'}
              </span>
            </button>
          </nav>

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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'text-stone-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-stone-300 hover:bg-slate-700 hover:text-white`}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">
                    {isPending ? 'Logging out...' : 'Logout'}
                  </span>
                </button>
              </nav>

              {/* Profile Section for Mobile */}
              <ProfileSection />
            </div>
          </div>
        </div>
      )}
    </>
  )
}