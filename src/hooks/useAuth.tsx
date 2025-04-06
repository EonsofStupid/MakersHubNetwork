
import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => ({ id: '' }),
  signOut: async () => {},
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
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
      return mockUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
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
