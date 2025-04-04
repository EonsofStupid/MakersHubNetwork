
import React, { useState, useEffect } from 'react';
import { useSiteTheme } from './SiteThemeProvider';
import { validateThemeVariables } from '@/utils/ThemeValidationUtils';
import { useThemeStore } from '@/stores/theme/store';

// Simple function to get theme storage info from localStorage
const getThemeStorageInfo = () => {
  try {
    const themeData = localStorage.getItem('theme-storage');
    return themeData ? JSON.parse(themeData) : null;
  } catch (e) {
    return { error: 'Failed to parse theme storage data' };
  }
};

/**
 * Debug component for theme testing
 * You can add this to any page to see current theme state
 */
export function ThemeDebugger() {
  const { componentStyles, isLoading, error } = useSiteTheme();
  const [themeState, setThemeState] = useState<any>(null);
  const [cssVars, setCssVars] = useState<Record<string, string>>({});
  const { currentTheme } = useThemeStore();
  
  // Derived state
  const isDark = document.documentElement.classList.contains('dark');
  
  useEffect(() => {
    // Log theme state
    const state = {
      currentThemeId: currentTheme?.id || 'none',
      isDark,
      componentStylesAvailable: !!componentStyles
    };
    setThemeState(state);
    
    // Get all CSS variables starting with --
    const computedStyle = getComputedStyle(document.documentElement);
    const varObject: Record<string, string> = {};
    
    // Filter for only theme-related variables
    const varPrefixes = ['--site-', '--primary', '--secondary', '--background', '--foreground', '--impulse-'];
    
    for (let i = 0; i < computedStyle.length; i++) {
      const prop = computedStyle[i];
      if (prop.startsWith('--') && varPrefixes.some(prefix => prop.startsWith(prefix))) {
        varObject[prop] = computedStyle.getPropertyValue(prop).trim();
      }
    }
    
    setCssVars(varObject);
  }, [componentStyles, currentTheme]);
  
  const themeValid = validateThemeVariables();
  const storageInfo = getThemeStorageInfo();
  
  // Get html element classes
  const htmlClasses = document.documentElement.className.split(' ');
  const htmlAttributes = Array.from(document.documentElement.attributes)
    .map(attr => ({ name: attr.name, value: attr.value }));
  
  return (
    <div className="theme-debugger border border-primary rounded-lg p-4 my-4 overflow-auto max-h-[500px] text-xs">
      <h3 className="text-lg font-bold mb-2">Theme Debugger</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-semibold">Theme Info</h4>
          <p>Is Dark: {isDark ? 'Yes' : 'No'}</p>
          <p>Theme Valid: {themeValid ? 'Yes' : 'No'}</p>
          <p>Theme ID: {currentTheme?.id || 'None'}</p>
          <p>Theme Name: {currentTheme?.name || 'None'}</p>
          
          <h4 className="font-semibold mt-4">HTML Element</h4>
          <div>
            <p className="mb-1">Classes:</p>
            <div className="bg-muted/30 p-2 rounded">
              {htmlClasses.map((cls, i) => (
                <span key={i} className="inline-block bg-muted/50 px-1 mr-1 mb-1 rounded">{cls}</span>
              ))}
            </div>
          </div>
          
          <div>
            <p className="mb-1">Attributes:</p>
            <div className="bg-muted/30 p-2 rounded">
              {htmlAttributes.map((attr, i) => (
                <div key={i} className="mb-1">
                  <span className="text-primary">{attr.name}</span>:
                  <span className="text-secondary ml-1">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold">Storage Info</h4>
          <pre className="bg-muted/30 p-2 rounded overflow-auto max-h-[100px] text-[10px]">
            {JSON.stringify(storageInfo, null, 2)}
          </pre>
          
          <h4 className="font-semibold mt-4">Theme Variables</h4>
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="bg-background text-foreground p-2 rounded">Background</div>
            <div className="bg-foreground text-background p-2 rounded">Foreground</div>
            <div className="bg-primary text-primary-foreground p-2 rounded">Primary</div>
            <div className="bg-secondary text-secondary-foreground p-2 rounded">Secondary</div>
            <div className="bg-muted text-muted-foreground p-2 rounded">Muted</div>
            <div className="bg-accent text-accent-foreground p-2 rounded">Accent</div>
          </div>
          
          <h4 className="font-semibold mt-4">CSS Variables</h4>
          <div className="bg-muted/30 p-2 rounded overflow-auto max-h-[200px]">
            {Object.entries(cssVars).map(([name, value]) => (
              <div key={name} className="mb-1 font-mono text-[10px]">
                <span className="text-primary">{name}</span>:
                <span className="text-secondary ml-1">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-semibold">Animation Test</h4>
        <div className="flex space-x-4 mt-2">
          <div className="animate-theme-pulse h-8 w-8 rounded-full border-2 border-primary"></div>
          <div className="animate-theme-glow text-lg">Glowing Text</div>
          <div className="animate-theme-border-pulse h-8 w-8 border-2 rounded"></div>
          <div className="animate-theme-loading h-8 w-8 rounded-full border-4 border-t-transparent"></div>
        </div>
      </div>
    </div>
  );
}
