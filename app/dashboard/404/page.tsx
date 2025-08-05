'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardNotFoundPage() {
    const router = useRouter()

    useEffect(() => {
        // Log for debugging
        console.log('Dashboard 404 page loaded')
    }, [])

    return (
        <div className="flex items-center justify-center min-h-screen pt-16">
            <div className="text-center max-w-lg mx-auto p-8">
                <div className="mb-12">
                    <div className="relative">
                        <h1 className="text-8xl font-bold text-orange-500 mb-6 drop-shadow-lg">404</h1>
                        <div className="absolute inset-0 text-8xl font-bold text-orange-200 blur-sm opacity-50">404</div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        The dashboard page you&apos;re looking for seems to have wandered off into the digital wilderness.
                    </p>
                </div>

                <div className="space-y-6">
                    <Link
                        href="/dashboard"
                        className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                        🏠 Back to Dashboard
                    </Link>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">Quick Navigation:</p>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/dashboard/analytics"
                                className="flex items-center justify-center py-2 px-4 bg-white rounded-lg border border-gray-200 text-gray-700 hover:text-orange-500 hover:border-orange-200 transition-all duration-200 text-sm font-medium"
                            >
                                📊 Analytics
                            </Link>
                            <Link
                                href="/dashboard/offers"
                                className="flex items-center justify-center py-2 px-4 bg-white rounded-lg border border-gray-200 text-gray-700 hover:text-orange-500 hover:border-orange-200 transition-all duration-200 text-sm font-medium"
                            >
                                🎯 Offers
                            </Link>
                            <Link
                                href="/dashboard/contacts"
                                className="flex items-center justify-center py-2 px-4 bg-white rounded-lg border border-gray-200 text-gray-700 hover:text-orange-500 hover:border-orange-200 transition-all duration-200 text-sm font-medium"
                            >
                                📧 Contacts
                            </Link>
                            <Link
                                href="/dashboard/users"
                                className="flex items-center justify-center py-2 px-4 bg-white rounded-lg border border-gray-200 text-gray-700 hover:text-orange-500 hover:border-orange-200 transition-all duration-200 text-sm font-medium"
                            >
                                👥 Users
                            </Link>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-300 flex items-center gap-2"
                        >
                            ← Go Back to Previous Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
