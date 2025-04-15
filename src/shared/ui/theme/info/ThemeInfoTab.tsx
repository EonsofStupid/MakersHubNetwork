
import React from 'react';
import { Theme } from '@/shared/types/features/theme.types';

interface ThemeInfoTabProps {
  theme: Theme;
}

export function ThemeInfoTab({ theme }: ThemeInfoTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Theme Information</h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <span className="text-sm font-medium">Name:</span>
            <p className="text-sm">{theme.name}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Mode:</span>
            <p className="text-sm">{theme.isDark ? 'Dark' : 'Light'}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Description:</span>
            <p className="text-sm">{theme.description || 'No description provided'}</p>
          </div>
        </div>
      </div>
      
      {theme.designTokens && (
        <div>
          <h3 className="text-lg font-medium">Colors</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {theme.designTokens.colors && Object.entries(theme.designTokens.colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ backgroundColor: value as string }} 
                />
                <span className="text-sm">{key}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
