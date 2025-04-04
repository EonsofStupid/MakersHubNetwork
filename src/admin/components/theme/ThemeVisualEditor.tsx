
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
      name: "Default Theme",
      colors: {
        primary: '#00F0FF',
        secondary: '#FF2D6E',
        background: { 
          main: '#12121A',
          overlay: 'rgba(22, 24, 29, 0.85)',
          card: 'rgba(28, 32, 42, 0.7)',
          alt: '#1A1E24'
        },
        text: { 
          primary: '#F6F6F7',
          secondary: 'rgba(255, 255, 255, 0.7)',
          muted: 'rgba(255, 255, 255, 0.5)',
          accent: '#00F0FF'
        },
        borders: {
          normal: 'rgba(0, 240, 255, 0.2)',
          hover: 'rgba(0, 240, 255, 0.4)',
          active: 'rgba(0, 240, 255, 0.6)',
          focus: 'rgba(0, 240, 255, 0.5)'
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6'
        }
      },
      effects: {
        shadows: {
          sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
          md: '0 4px 6px rgba(0, 0, 0, 0.1)',
          lg: '0 10px 25px rgba(0, 0, 0, 0.1)',
          xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        },
        glow: {
          primary: '0 0 15px rgba(0, 240, 255, 0.5)',
          secondary: '0 0 15px rgba(255, 45, 110, 0.5)',
          hover: '0 0 20px rgba(0, 240, 255, 0.7)'
        }
      },
      animation: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms'
        },
        curves: {
          bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
          spring: 'cubic-bezier(0.155, 1.105, 0.295, 1.12)',
          linear: 'linear'
        }
      },
      components: {
        panel: {
          radius: '0.5rem',
          padding: '1.5rem',
          background: 'rgba(28, 32, 42, 0.7)'
        },
        button: {
          radius: '0.375rem',
          padding: '0.5rem 1rem',
          transition: 'all 0.2s ease'
        },
        tooltip: {
          radius: '0.25rem',
          padding: '0.5rem',
          background: 'rgba(0, 0, 0, 0.8)'
        },
        input: {
          radius: '0.375rem',
          padding: '0.5rem',
          background: 'rgba(28, 32, 42, 0.7)'
        }
      },
      typography: {
        fonts: {
          body: 'Inter, system-ui, sans-serif',
          heading: 'Inter, system-ui, sans-serif',
          mono: 'Consolas, Monaco, monospace'
        },
        sizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          md: '1.1rem',
          lg: '1.25rem',
          xl: '1.5rem',
          '2xl': '2rem',
          '3xl': '2.5rem'
        },
        weights: {
          light: 300,
          normal: 400,
          medium: 500,
          bold: 700
        },
        lineHeights: {
          tight: '1.1',
          normal: '1.5',
          relaxed: '1.8'
        }
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
