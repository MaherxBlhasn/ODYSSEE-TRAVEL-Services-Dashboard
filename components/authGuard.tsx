'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import FullScreenSpinner from './ui/FullScreenSpinner';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { authenticated } = await authService.checkAuth();
      console.log('AuthGuard checkAuth response:', authenticated);
      
      if (!authenticated) {
        router.push('/login'); // Redirect if not authenticated
      } else {
        router.push('/dashboard'); // Redirect to dashboard if authenticated
      }
      setLoading(false);
    };

    check();
  }, [router]);

  if (loading) return <FullScreenSpinner/>;

  return <>{children}</>;
}
