'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import FullScreenSpinner from './ui/FullScreenSpinner';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authenticated } = await authService.checkAuth();
        console.log('AuthGuard - checkAuth response:', authenticated);

        if (!authenticated) {
          console.log('Not authenticated, redirecting to login');
          router.push('/login');
        } else {
          console.log("User is authenticated, allowing access");
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading while checking authentication
  if (loading) return <FullScreenSpinner />
  
  // If not authenticated, don't render children (redirect is happening)
  if (!isAuthenticated) return null;

  // User is authenticated, render the protected content
  return <>{children}</>;
}
