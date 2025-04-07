
import React from 'react';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import { ImpulsivityThemeInitializer } from '@/components/theme/ImpulsivityThemeInitializer';
import { SiteThemeProvider } from '@/components/theme/SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface AppProviderProps {
  children: React.ReactNode;
  themeContext?: 'site' | 'admin' | 'chat' | 'app' | 'training';
}

export function AppProvider({ 
  children,
  themeContext = 'site'
}: AppProviderProps) {
  const logger = useLogger('AppProvider', LogCategory.SYSTEM);

  return (
    <ThemeInitializer 
      context={themeContext} 
      fallbackTheme={{
        primary: '186 100% 50%',
        secondary: '334 100% 59%',
        background: '228 47% 8%',
        foreground: '210 40% 98%'
      }}
    >
      <SiteThemeProvider>
        <ImpulsivityThemeInitializer>
          {children}
        </ImpulsivityThemeInitializer>
      </SiteThemeProvider>
    </ThemeInitializer>
  );
}

export default AppProvider;
