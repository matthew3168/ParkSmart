import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await auth.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    signIn: async (email: string, password: string) => {
      const result = await auth.signIn(email, password);
      await checkAuth();
      return result;
    },
    signOut: () => {
      auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};