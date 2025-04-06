
import React from 'react';
import { cn } from '@/lib/utils';
import { ThemeToken } from '@/types/theme';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';

interface ThemeColorSystemProps {
  tokens: ThemeToken[];
  onChange?: (tokenId: string, value: string) => void;
  className?: string;
}

export function ThemeColorSystem({ tokens, onChange, className }: ThemeColorSystemProps) {
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null);
  const [colorValue, setColorValue] = useState<string | null>(null);
  
  const handleTokenClick = (token: ThemeToken) => {
    if (!token.token_name) return;
    
    setActiveTokenId(token.id);
    setColorValue(token.token_value || null);
  };
  
  const handleColorChange = (color: string) => {
    setColorValue(color);
    
    if (activeTokenId && onChange) {
      onChange(activeTokenId, color);
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
