'use client';

import { startTransition, useEffect, useState, useRef } from 'react';
import { authService } from '@/lib/services/auth.service';
import { useRouter, usePathname } from 'next/navigation';

export default function SessionAlert() {
  const router = useRouter();
  const pathname = usePathname();
  const [expired, setExpired] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    try {
      await authService.logout();
      // Clear the interval when logging out
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Reset expired state before redirecting
      setExpired(false);
      startTransition(() => {
        router.push('/login');
      });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false); // Re-enable button on error
    }
  };

  const verifySession = async () => {
    // Don't check session if already expired or on login page
    if (expired || pathname === '/login') return;
    
    try {
      const res = await authService.checkAuth();
      if (!res.authenticated) {
        setExpired(true);
      } else if (expired) {
        // Reset expired state if user is now authenticated
        setExpired(false);
      }
    } catch (error) {
      console.error('Session verification error:', error);
      if (!expired) {
        setExpired(true);
      }
    }
  };

  useEffect(() => {
    // Reset expired state when pathname changes to login
    if (pathname === '/login') {
      setExpired(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial session check
    verifySession();

    // Set up interval for periodic checks
    intervalRef.current = setInterval(verifySession, 2 * 60 * 1000); // Check every minute

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pathname, expired]);

  // Reset states when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!expired || pathname === '/login') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()} // Prevent closing on backdrop click for security
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Session Expired</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            Your session has expired for security reasons. Please log in again to continue using the application.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Log In Again</span>
                </>
              )}
            </button>
            
            {/* Optional: Add a secondary action */}
            <p className="text-xs text-gray-500 text-center">
              You will be redirected to the login page
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
      </div>
    </div>
  );
}