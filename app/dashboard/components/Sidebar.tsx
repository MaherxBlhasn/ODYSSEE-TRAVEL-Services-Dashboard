'use client'

import {
  Home,
  Package,
  Mail,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth.service'
import { useTransition } from 'react'

const sidebarItems = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'offers', label: 'Offers', icon: Package },
  { id: 'contacts', label: 'Contacts', icon: Mail },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 shadow-lg">
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'text-stone-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">
              {isPending ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </nav>
      </div>
    </div>
  )
}
