import React from 'react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>
                    <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
                    <p className="text-gray-300 text-lg mb-8">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>
                <div className="space-y-4">
                    <Link
                        href="/dashboard"
                        className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Go Dashboard
                    </Link>
                </div>
                {/* ODYSSEE Branding */}
                <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold text-white mb-1">ODYSSEE</h3>
                    <p className="text-orange-400 text-sm tracking-wide">TRAVEL SERVICE</p>
                </div>
            </div>
        </div>
    )
}
