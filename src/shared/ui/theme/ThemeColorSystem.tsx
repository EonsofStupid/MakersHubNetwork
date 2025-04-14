
import React from 'react';
import { ThemeToken } from '@/types/theme';

interface ThemeColorSystemProps {
  tokens?: ThemeToken[];
  className?: string;
}

export const ThemeColorSystem: React.FC<ThemeColorSystemProps> = ({ 
  tokens = [], 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {tokens
        .filter(token => token.category === 'colors')
        .map(token => (
          <div key={token.id} className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full border border-gray-200" 
              style={{ backgroundColor: token.value || token.token_value }}
            />
            <span className="text-sm">{token.token_name}</span>
          </div>
        ))}
    </div>
  );
};

export default ThemeColorSystem;
