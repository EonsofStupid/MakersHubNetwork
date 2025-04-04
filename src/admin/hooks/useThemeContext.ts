
import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAdminRoles } from './useAdminRoles';

/**
 * Hook for managing theme context in the admin panel
 */
export function useThemeContext() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminRoles();
  const [activeTheme, setActiveTheme] = useState<string>('default');
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const { toast } = useToast();
  const logger = useLogger('useThemeContext', { category: LogCategory.THEME });
  
  // Set theme editing permissions
  useEffect(() => {
    // Only admins can edit themes
    setCanEdit(!!user && isAdmin);
  }, [user, isAdmin]);
  
  // Handle theme change
  const changeTheme = (themeId: string) => {
    try {
      setActiveTheme(themeId);
      logger.info(`Changed active theme to: ${themeId}`);
      
      // You could persist the theme change to a database here
      
      toast({
        title: "Theme changed",
        description: `Theme has been changed to ${themeId}`,
      });
    } catch (error) {
      logger.error('Error changing theme', {
        details: { error, themeId }
      });
      
      toast({
        title: "Error changing theme",
        description: "There was an error changing the theme",
        variant: "destructive",
      });
    }
  };
  
  // Log out user
  const handleLogout = async () => {
    try {
      await signOut();
      logger.info('User logged out from theme context');
    } catch (error) {
      logger.error('Error logging out', {
        details: { error }
      });
      
      toast({
        title: "Error logging out",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };
  
  return {
    activeTheme,
    canEdit,
    user,
    changeTheme,
    logout: handleLogout
  };
}
