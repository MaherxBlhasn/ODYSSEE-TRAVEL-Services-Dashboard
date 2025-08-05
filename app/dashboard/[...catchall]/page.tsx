'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardCatchAll() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to our custom 404 page within dashboard
    router.replace('/dashboard/404')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
