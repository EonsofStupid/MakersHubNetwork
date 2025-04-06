
import { useContext, createContext, useState, useEffect } from 'react';

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

// Create a default context
const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => ({ id: '' }),
  signOut: async () => {},
  isAuthenticated: false,
  isLoading: false,
  error: null
});

// Simple hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Export the AuthContext for use in the provider
export { AuthContext };

