
import React, { useState } from 'react';
import { themeRegistry } from '../ThemeRegistry';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { defaultImpulseTokens } from '../impulse/tokens';

export function ThemeDebugger() {
  const [isExpanded, setIsExpanded] = useState(false);
  const logger = useLogger('ThemeDebugger', { category: LogCategory.THEME });
  
  const activeTheme = themeRegistry.getActiveTheme() || defaultImpulseTokens;
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    logger.debug('Theme debugger toggled', { details: { expanded: !isExpanded } });
  };
  
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div 
      className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg shadow-lg text-xs"
      style={{ maxWidth: isExpanded ? '500px' : '200px', maxHeight: isExpanded ? '80vh' : '40px', overflow: 'auto' }}
    >
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleExpanded}>
        <h4 className="font-mono">Theme Debug</h4>
        <span>{isExpanded ? '▼' : '▲'}</span>
      </div>
      
      {isExpanded && (
        <div className="mt-2 space-y-2">
          <div>
            <div className="text-gray-400">Active Theme:</div>
            <div>{activeTheme.name || 'Unnamed'}</div>
          </div>
          
          <div>
            <div className="text-gray-400">Primary Color:</div>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: activeTheme.colors.primary }}
              ></div>
              <span>{activeTheme.colors.primary}</span>
            </div>
          </div>
          
          <div>
            <div className="text-gray-400">Secondary Color:</div>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: activeTheme.colors.secondary }}
              ></div>
              <span>{activeTheme.colors.secondary}</span>
            </div>
          </div>
          
          <div>
            <div className="text-gray-400">Registered Themes:</div>
            <div>{themeRegistry.getAllThemes().length}</div>
          </div>
        </div>
      )}
    </div>
  );
}
