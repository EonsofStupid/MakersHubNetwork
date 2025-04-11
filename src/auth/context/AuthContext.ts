
import { createContext } from 'react';
import { AuthContextType } from '@/auth/types/auth.types';

// Default context value
const defaultAuthContext: AuthContextType = {
  user: null,
  session: null,
  profile: null,
  status: 'idle'
};

// Create the context
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);
