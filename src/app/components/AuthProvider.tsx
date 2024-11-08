'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<any>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await auth.isAuthenticated();
      console.log('Auth status checked:', isAuth);
      setIsAuthenticated(isAuth);

      // If on login page and authenticated, redirect to dashboard
      if (isAuth && window.location.pathname === '/login') {
        router.push('/dashboard');
      }
      // If not authenticated and on dashboard, redirect to login
      else if (!isAuth && window.location.pathname === '/dashboard') {
        router.push('/');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const result = await auth.signIn(username, password);
      setIsAuthenticated(true);
      router.push('/dashboard');
      return result;
    } catch (error) {
      console.error('Sign in failed:', error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const signOut = () => {
    auth.signOut();
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};