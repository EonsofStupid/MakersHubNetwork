import { createContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from "@/stores/auth/types/auth.types";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  roles: UserRole[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  roles: [],
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserRoles(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setRoles([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setRoles(data.map((r) => r.role));
    } catch (error) {
      console.error('Error fetching user roles:', error);
      toast({
        variant: "destructive",
        title: "Error fetching user roles",
        description: "Please try logging in again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Logged in successfully",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error logging in",
        description: "Please check your credentials and try again",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setSession(null);
      setUser(null);
      setRoles([]);
      toast({
        title: "Logged out successfully",
        description: "Come back soon!",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        roles,
        isAuthenticated: !!session,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};