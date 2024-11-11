// components/AdminProtected.tsx
'use client';
import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && isAdmin ? <>{children}</> : null;
}