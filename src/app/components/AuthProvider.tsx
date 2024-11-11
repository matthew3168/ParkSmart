// AuthProvider.tsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<any>;
  adminSignIn: (username: string, password: string) => Promise<any>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await auth.isAuthenticated();
      const adminStatus = isAuth ? await auth.isAdmin() : false;
      
      setIsAuthenticated(isAuth);
      setIsAdmin(adminStatus);

      // Handle redirects
      if (isAuth) {
        if (adminStatus && window.location.pathname === '/admin/login') {
          router.push('/admin/dashboard');
        } else if (!adminStatus && window.location.pathname.startsWith('/admin')) {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const result = await auth.signIn(username, password);
      setIsAuthenticated(true);
      const adminStatus = await auth.isAdmin();
      setIsAdmin(adminStatus);
      return result;
    } catch (error) {
      console.error('Sign in failed:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
      throw error;
    }
  };

  const adminSignIn = async (username: string, password: string) => {
    try {
      const result = await auth.adminSignIn(username, password);
      setIsAuthenticated(true);
      setIsAdmin(true);
      return result;
    } catch (error) {
      console.error('Admin sign in failed:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
      throw error;
    }
  };

  const signOut = () => {
    auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdmin, 
      isLoading, 
      signIn, 
      adminSignIn, 
      signOut 
    }}>
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