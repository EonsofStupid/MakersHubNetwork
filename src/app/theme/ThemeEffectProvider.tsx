
import React from 'react';
import { ThemeEffect } from '@/shared/types/shared.types';

interface ThemeEffectProviderProps {
  effect: ThemeEffect;
  children: React.ReactNode;
}

export function ThemeEffectProvider({ effect, children }: ThemeEffectProviderProps) {
  // In a real implementation, this would apply different effects based on the theme
  return <>{children}</>;
}
