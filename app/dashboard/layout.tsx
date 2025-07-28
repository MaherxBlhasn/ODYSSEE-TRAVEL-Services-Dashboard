import Sidebar from './components/Sidebar'
import AuthGuard from '@/components/authGuard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-stone-200 flex">
        {/* Sidebar will handle its own responsive behavior */}
        <Sidebar />

        {/* Main content - adjusted for mobile header */}
        <div className="flex-1 md:ml-64 p-6 transition-all duration-300 mt-16 md:mt-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}