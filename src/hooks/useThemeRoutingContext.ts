
import { useEffect, useState } from 'react';
import { useLocation } from '@tanstack/react-router';
import { getThemeContextForRoute } from '@/routeRegistry';
import { ThemeContext } from '@/types/theme';
import { parseThemeContext } from '@/types/themeContext';

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
