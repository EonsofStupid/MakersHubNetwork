
import React from 'react';
import { cn } from '@/lib/utils';
import { ThemeToken } from '@/types/theme';
import { HexColorPicker } from 'react-colorful';
import { useState, useEffect } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface ThemeColorSystemProps {
  tokens: ThemeToken[];
  onChange?: (tokenId: string, value: string) => void;
  className?: string;
}

export function ThemeColorSystem({ tokens, onChange, className }: ThemeColorSystemProps) {
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null);
  const [colorValue, setColorValue] = useState<string | null>(null);
  const logger = useLogger('ThemeColorSystem', LogCategory.UI);
  
  // Apply all color tokens immediately on mount and whenever tokens change
  useEffect(() => {
    if (!tokens || tokens.length === 0) {
      // Apply fallback colors if no tokens are available
      applyFallbackColors();
      return;
    }
    
    try {
      logger.info('Applying color tokens to CSS variables');
      const rootElement = document.documentElement;

      // Force apply all color tokens to ensure they're visible
      tokens.forEach(token => {
        if (token.category === 'color' && token.token_name && token.token_value) {
          // Apply color value
          const colorValue = token.token_value;
          
          // Apply as CSS variable with multiple formats for maximum compatibility
          
          // Format 1: Direct variable name if it starts with --
          if (token.token_name.startsWith('--')) {
            rootElement.style.setProperty(token.token_name, colorValue);
          } 
          // Format 2: Add -- prefix if not present
          else {
            rootElement.style.setProperty(`--${token.token_name}`, colorValue);
          }
          
          // Format 3: Add site- prefix for theme system compatibility
          if (!token.token_name.startsWith('--site-') && !token.token_name.startsWith('site-')) {
            rootElement.style.setProperty(`--site-${token.token_name}`, colorValue);
          }
          
          // If this is a primary/secondary/background color, apply additional formats
          if (token.token_name.includes('primary') || 
              token.token_name.includes('secondary') || 
              token.token_name.includes('background') ||
              token.token_name.includes('foreground')) {
            
            // Apply as impulse- prefixed variable for admin themes
            rootElement.style.setProperty(`--impulse-${token.token_name}`, colorValue);
            
            // Apply standard Tailwind format without site- prefix
            const tailwindName = token.token_name.replace('site-', '');
            rootElement.style.setProperty(`--${tailwindName}`, colorValue);
          }
        }
      });
      
      // After applying all tokens, apply critical colors again to ensure they take precedence
      applyCriticalColors();
      
    } catch (error) {
      logger.error('Failed to apply color tokens', { 
        error,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      
      // Apply fallback colors on error
      applyFallbackColors();
    }
  }, [tokens, logger]);
  
  // Apply critical colors that must always be visible
  const applyCriticalColors = () => {
    const rootElement = document.documentElement;
    
    // Primary theme colors
    rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
    rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
    
    // Effect colors as direct hex
    rootElement.style.setProperty('--site-effect-color', '#00F0FF');
    rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
    
    // Standard variables
    rootElement.style.setProperty('--primary', 'hsl(186 100% 50%)');
    rootElement.style.setProperty('--secondary', 'hsl(334 100% 59%)');
    
    // Direct hex fallbacks
    rootElement.style.setProperty('--impulse-primary', '#00F0FF');
    rootElement.style.setProperty('--impulse-secondary', '#FF2D6E');
  };
  
  // Apply fallback colors if no tokens are available
  const applyFallbackColors = () => {
    const rootElement = document.documentElement;
    
    // Primary theme colors
    rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
    rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
    
    // Effect colors
    rootElement.style.setProperty('--site-effect-color', '#00F0FF');
    rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
    
    // Background and text colors
    rootElement.style.setProperty('--site-background', '228 47% 8%'); // #080F1E in HSL
    rootElement.style.setProperty('--site-foreground', '210 40% 98%'); // #F9FAFB in HSL
    rootElement.style.setProperty('--site-card', '228 47% 11%');
    rootElement.style.setProperty('--site-card-foreground', '210 40% 98%');
    
    // Standard CSS variables
    rootElement.style.setProperty('--background', 'hsl(228 47% 8%)');
    rootElement.style.setProperty('--foreground', 'hsl(210 40% 98%)');
    rootElement.style.setProperty('--card', 'hsl(228 47% 11%)');
    rootElement.style.setProperty('--primary', 'hsl(186 100% 50%)');
    rootElement.style.setProperty('--secondary', 'hsl(334 100% 59%)');
    
    // Impulse specific variables
    rootElement.style.setProperty('--impulse-primary', '#00F0FF');
    rootElement.style.setProperty('--impulse-secondary', '#FF2D6E');
    rootElement.style.setProperty('--impulse-bg-main', '#080F1E');
  };
  
  const handleTokenClick = (token: ThemeToken) => {
    if (!token.token_name) return;
    
    setActiveTokenId(token.id);
    setColorValue(token.token_value || null);
    
    // Apply the selected color immediately for preview
    if (token.token_name && token.token_value) {
      const rootElement = document.documentElement;
      
      // Apply in all possible formats for maximum compatibility
      if (token.token_name.startsWith('--')) {
        rootElement.style.setProperty(token.token_name, token.token_value);
      } else {
        rootElement.style.setProperty(`--${token.token_name}`, token.token_value);
      }
      
      if (!token.token_name.startsWith('site-')) {
        rootElement.style.setProperty(`--site-${token.token_name}`, token.token_value);
      }
      
      // Apply critical colors again to ensure consistency
      applyCriticalColors();
    }
  };
  
  const handleColorChange = (color: string) => {
    setColorValue(color);
    
    if (activeTokenId && onChange) {
      onChange(activeTokenId, color);
      
      // Apply the new color immediately
      const token = tokens.find(t => t.id === activeTokenId);
      if (token && token.token_name) {
        const rootElement = document.documentElement;
        
        // Apply in all possible formats for maximum compatibility
        if (token.token_name.startsWith('--')) {
          rootElement.style.setProperty(token.token_name, color);
        } else {
          rootElement.style.setProperty(`--${token.token_name}`, color);
        }
        
        if (!token.token_name.startsWith('site-')) {
          rootElement.style.setProperty(`--site-${token.token_name}`, color);
        }
        
        // Special handling for primary/secondary colors
        if (token.token_name.includes('primary') || token.token_name.includes('secondary')) {
          // Apply as impulse- prefixed variable for admin themes
          rootElement.style.setProperty(`--impulse-${token.token_name.replace('site-', '')}`, color);
        }
      }
      
      // After changing a color, apply critical colors again to ensure consistency
      applyCriticalColors();
    }
  };
  
  const colorTokens = tokens.filter(token => token.category === 'color');
  
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {colorTokens.map((token) => (
          <div
            key={token.id}
            className={cn(
              'p-2 border rounded-md cursor-pointer transition-all hover:shadow-md',
              activeTokenId === token.id ? 'ring-2 ring-primary' : 'ring-0'
            )}
            onClick={() => handleTokenClick(token)}
          >
            <div 
              className="w-full h-16 rounded mb-2" 
              style={{ backgroundColor: token.token_value || '#CCCCCC' }}
            />
            <div className="text-sm font-medium">{token.token_name}</div>
            
            {token.description && (
              <div className="text-xs text-muted-foreground mt-1" title={token.description || ''}>
                {(token.description || '').substring(0, 24)}
                {token.description && token.description.length > 24 ? '...' : ''}
              </div>
            )}
            
            {token.fallback_value && (
              <div className="text-xs text-muted-foreground mt-1">
                Fallback: <code className="bg-muted px-1 rounded text-[10px]">{token.fallback_value}</code>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {activeTokenId && colorValue && (
        <div className="border rounded-lg p-4 mt-4">
          <h3 className="text-lg font-medium mb-3">Edit Color</h3>
          <HexColorPicker color={colorValue} onChange={handleColorChange} />
          <div className="mt-4 flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded border" 
              style={{ backgroundColor: colorValue }}
            />
            <input
              type="text"
              value={colorValue}
              onChange={(e) => handleColorChange(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
