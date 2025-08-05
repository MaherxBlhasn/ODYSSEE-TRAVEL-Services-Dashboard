'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { authenticated } = await authService.checkAuth();
        console.log("Root page - authenticated:", authenticated);
        
        if (authenticated) {
          // If logged in, redirect to dashboard
          router.push('/dashboard');
        } else {
          // If not logged in, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // On error, redirect to login
        router.push('/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">
          {isChecking ? 'Checking authentication...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  );
}