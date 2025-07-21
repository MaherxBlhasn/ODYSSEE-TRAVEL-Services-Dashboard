import Sidebar from './components/Sidebar'
import AuthGuard from '@/components/authGuard'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-stone-200">
        <Sidebar />
        <div className="ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}