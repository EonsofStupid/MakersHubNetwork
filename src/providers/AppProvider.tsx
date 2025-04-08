
import React from 'react';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import { ImpulsivityThemeInitializer } from '@/components/theme/ImpulsivityThemeInitializer';
import { SiteThemeProvider } from '@/components/theme/SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ThemeContext } from '@/types/theme';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface AppProviderProps {
  children: React.ReactNode;
  themeContext?: ThemeContext;
}

const VALID_THEME_CONTEXTS = ['site', 'admin', 'chat'];

export function AppProvider({ 
  children,
  themeContext = 'site'
}: AppProviderProps) {
  const logger = useLogger('AppProvider', LogCategory.SYSTEM);

  // Validate the theme context
  if (!VALID_THEME_CONTEXTS.includes(themeContext)) {
    logger.error(`Invalid themeContext: "${themeContext}" — defaulting to "site"`);
    themeContext = 'site'; // Ensure we have a valid context
  }

  // Add error boundary to prevent theme errors from breaking the app
  return (
    <ErrorBoundary 
      fallback={
        <div className="p-4 text-white bg-black/80 min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl mb-4">Theme Error</h1>
            <p>There was a problem loading the application theme. Try refreshing the page.</p>
          </div>
        </div>
      }
    >
      <ThemeInitializer 
        themeContext={themeContext}
        applyImmediately={true}
        fallbackTheme={{
          primary: '186 100% 50%',
          secondary: '334 100% 59%',
          background: '228 47% 8%',
          foreground: '210 40% 98%',
        }}
      >
        <SiteThemeProvider>
          <ImpulsivityThemeInitializer>
            {children}
          </ImpulsivityThemeInitializer>
        </SiteThemeProvider>
      </ThemeInitializer>
    </ErrorBoundary>
  );
}

export default AppProvider;
