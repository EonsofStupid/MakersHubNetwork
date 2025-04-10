
import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@/types/auth.types';

interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: UserMetadata;
}

export interface AuthContextType {
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => ({ id: '' }),
  signOut: async () => {},
  isLoading: false,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('impulse_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user', err);
      }
    }
    setIsLoading(false);
  }, []);
  
  // Sign in function
  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an authentication API
      const mockUser = {
        id: '123456',
        email: email,
        user_metadata: {
          full_name: 'Cyber User',
          avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + email,
        },
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('impulse_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out function
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      localStorage.removeItem('impulse_user');
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
