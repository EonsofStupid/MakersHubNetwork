
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeContext } from '@/types/theme';
import { parseThemeContext } from '@/types/themeContext';

// Determine theme context based on route path
function getThemeContextForRoute(pathname: string): ThemeContext {
  if (pathname.startsWith('/admin')) {
    return 'admin';
  }
  if (pathname.startsWith('/chat')) {
    return 'chat';
  }
  return 'app';
}

export function useThemeRoutingContext() {
  const location = useLocation();
  const [themeContext, setThemeContext] = useState<ThemeContext>('app');
  
  useEffect(() => {
    if (location && location.pathname) {
      // Get theme context based on current route
      const routeContext = getThemeContextForRoute(location.pathname);
      setThemeContext(parseThemeContext(routeContext));
    }
  }, [location]);
  
  return { themeContext };
}
