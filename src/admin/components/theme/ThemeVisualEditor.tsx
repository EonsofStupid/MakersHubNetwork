
import React from 'react';
import { ImpulseTheme } from '@/admin/types/impulse.types';
import { themeRegistry } from '@/admin/theme/ThemeRegistry';

interface ThemeVisualEditorProps {
  themeId?: string;
}

export function ThemeVisualEditor({ themeId }: ThemeVisualEditorProps) {
  const theme: ImpulseTheme = React.useMemo(() => {
    if (themeId) {
      const loadedTheme = themeRegistry.getTheme(themeId);
      if (loadedTheme) return loadedTheme;
    }
    
    // Fallback to default theme
    return themeRegistry.getDefaultTheme() || {
      colors: {
        primary: '#00F0FF',
        secondary: '#FF2D6E',
        background: { main: '#12121A' },
        text: { primary: '#F6F6F7' }
      }
    };
  }, [themeId]);

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-medium">Theme Preview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div 
              className="w-12 h-12 rounded-md" 
              style={{ backgroundColor: theme.colors.primary }}
              title="Primary Color"
            />
            <div 
              className="w-12 h-12 rounded-md" 
              style={{ backgroundColor: theme.colors.secondary }}
              title="Secondary Color"
            />
            <div 
              className="w-12 h-12 rounded-md" 
              style={{ backgroundColor: theme.colors.accent || '#8B5CF6' }}
              title="Accent Color"
            />
          </div>
          
          <div 
            className="p-4 rounded-md text-center"
            style={{ 
              backgroundColor: theme.colors.background.main,
              color: theme.colors.text.primary
            }}
          >
            Background with Text
          </div>
        </div>
        
        <div 
          className="p-4 rounded-md"
          style={{ 
            backgroundColor: theme.colors.background.card || theme.colors.background.main,
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.borders?.normal || 'rgba(255,255,255,0.1)'}`
          }}
        >
          <h4 className="font-medium mb-2">Card Example</h4>
          <p style={{ color: theme.colors.text.secondary || theme.colors.text.primary }}>
            This is what a card would look like with this theme applied.
          </p>
          <button
            className="mt-2 px-3 py-1 rounded-md text-sm"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.primary || '#fff'
            }}
          >
            Button
          </button>
        </div>
      </div>
    </div>
  );
}
