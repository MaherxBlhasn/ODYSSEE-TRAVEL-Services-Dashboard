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

const sidebarItems = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'offers', label: 'Offers', icon: Package },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'contacts', label: 'Contacts', icon: Mail },
  { id: 'users', label: 'Users', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const activeTab = pathname.split('/').pop() || 'dashboard'

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
            </div>
          </div>
        </div>
      )}
    </>
  )
}