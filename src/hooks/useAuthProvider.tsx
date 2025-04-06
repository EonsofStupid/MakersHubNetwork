
import { useState, useEffect } from 'react';
import { AuthContext } from './use-auth';
import { publishAuthEvent } from '@/auth/bridge';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('impulse_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        publishAuthEvent('login', { user: parsedUser });
      } catch (err) {
        console.error('Failed to parse saved user', err);
      }
    }
    setIsLoading(false);
  }, []);
  
  // Mock sign in function
  const signIn = async (email: string, password: string): Promise<User> => {
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
      publishAuthEvent('login', { user: mockUser });
      return mockUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      publishAuthEvent('error', { message: errorMessage });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock sign out function
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      localStorage.removeItem('impulse_user');
      setUser(null);
      publishAuthEvent('logout');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      publishAuthEvent('error', { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Computed property to check if user is authenticated
  const isAuthenticated = user !== null;
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, 
      signOut, 
      isAuthenticated,
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
