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
      if (!authenticated) {
        router.push('/login'); // Redirect if not authenticated
      } else {
        setLoading(false);
      }
    };

    check();
  }, [router]);

  if (loading) return <FullScreenSpinner/>;

  return <>{children}</>;
}
