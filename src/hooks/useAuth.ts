
import { useContext, createContext } from 'react';

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
  setUser: (user: User | null) => void; 
  signIn?: (email: string, password: string) => Promise<User>;
  signOut?: () => Promise<void>;
  logout?: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

// Create a default context
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {}
});

// Simple hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Export the AuthContext for use in the provider
export { AuthContext };

// Export a simple provider that can be used in tests/storybook
export const AuthProvider = ({ children, value }: { children: React.ReactNode, value?: AuthContextType }) => {
  const defaultValue: AuthContextType = {
    user: null,
    setUser: () => {}
  };

  return (
    <AuthContext.Provider value={value || defaultValue}>
      {children}
    </AuthContext.Provider>
  );
};
