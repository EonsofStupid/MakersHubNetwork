
import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { useThemeStore } from '@/stores/theme/themeStore';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { LogToggleButton } from '@/logging/components/LogToggleButton';
import { LogConsole } from '@/logging/components/LogConsole';
import { useLoggingContext } from '@/logging/context/LoggingContext';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const logger = useLogger('MainLayout', LogCategory.UI);
  const { currentTheme, loadStatus } = useThemeStore();
  const { showLogConsole } = useLoggingContext();
  
  return (
    <ThemeInitializer 
      themeContext="site" 
      applyImmediately={true}
      fallbackTheme={{
        primary: '186 100% 50%',
        secondary: '334 100% 59%',
        background: '228 47% 8%',
        foreground: '210 40% 98%'
      }}
    >
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <main className="flex-1">
          {children || <Outlet />}
        </main>
        {showLogConsole && <LogConsole />}
        <LogToggleButton />
      </div>
    </ThemeInitializer>
  );
}
