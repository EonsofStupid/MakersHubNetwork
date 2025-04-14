
import React from 'react';
import { ThemeEffect } from '@/shared/types/theme.types';

interface EffectsPreviewProps {
  effect?: ThemeEffect;
  className?: string;
}

export const EffectsPreview: React.FC<EffectsPreviewProps> = ({ 
  effect, 
  className = '' 
}) => {
  if (!effect || !effect.enabled) {
    return null;
  }
  
  return (
    <div className={`p-4 border rounded ${className}`}>
      <h3 className="font-medium">Effect: {effect.type}</h3>
      <div className="mt-2 text-sm">
        <p>Intensity: {effect.intensity || 'N/A'}</p>
        {effect.color && <p>Color: {effect.color}</p>}
      </div>
    </div>
  );
};

export default EffectsPreview;
