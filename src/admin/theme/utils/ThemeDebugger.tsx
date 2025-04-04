
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { themeRegistry } from '@/admin/theme/ThemeRegistry';
import { useThemeStore } from '@/stores/theme/store';

/**
 * Theme debugger component that shows current theme information
 * Only visible in development mode
 */
export function ThemeDebugger() {
  const { currentTheme } = useThemeStore();
  const registryTheme = React.useMemo(() => {
    // We need to use getTheme instead of getActiveTheme
    const activeThemeId = currentTheme?.id;
    return activeThemeId ? themeRegistry.getTheme(activeThemeId) : null;
  }, [currentTheme]);

  if (!currentTheme) return null;

  return (
    <div className="fixed bottom-4 right-4 p-3 bg-black/80 backdrop-blur-sm text-white text-xs rounded-md max-w-xs z-50">
      <div className="font-mono">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">Theme Debug</span>
          <Badge variant="outline" className="text-[10px]">DEV</Badge>
        </div>
        
        <div className="space-y-1">
          <p>ID: <span className="text-primary">{currentTheme.id.substring(0, 8)}...</span></p>
          <p>Name: <span className="text-primary">{currentTheme.name}</span></p>
          <p>Registry: <span className={registryTheme ? 'text-green-400' : 'text-red-400'}>
            {registryTheme ? '✅ Loaded' : '❌ Missing'}
          </span></p>
        </div>
      </div>
    </div>
  );
}
