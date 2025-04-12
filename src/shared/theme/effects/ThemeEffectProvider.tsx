import React, { createContext, useContext, useState, useCallback } from 'react';
import { ThemeEffect, ThemeEffectProps } from '@/shared/types/theme/effects';

interface ThemeEffectContextType {
  effects: Record<string, ThemeEffect>;
  addEffect: (elementId: string, effect: ThemeEffect) => void;
  removeEffect: (effectId: string) => void;
  getEffectForElement: (elementId: string) => ThemeEffect | undefined;
}

const ThemeEffectContext = createContext<ThemeEffectContextType>({
  effects: {},
  addEffect: () => {},
  removeEffect: () => {},
  getEffectForElement: () => undefined,
});

export const useThemeEffect = () => useContext(ThemeEffectContext);

interface ThemeEffectProviderProps {
  children: React.ReactNode;
  maxEffects?: number;
}

export function ThemeEffectProvider({ 
  children, 
  maxEffects = 10 
}: ThemeEffectProviderProps) {
  const [effects, setEffects] = useState<Record<string, ThemeEffect>>({});

  const addEffect = useCallback((elementId: string, effect: ThemeEffect) => {
    setEffects(prev => {
      const effectWithId = effect as ThemeEffect & { id: string };
      const newEffects = { ...prev, [effectWithId.id]: effectWithId };
      
      // Limit the number of active effects
      const effectIds = Object.keys(newEffects);
      if (effectIds.length > maxEffects) {
        const oldestId = effectIds[0];
        const { [oldestId]: _, ...rest } = newEffects;
        return rest;
      }
      
      return newEffects;
    });
  }, [maxEffects]);

  const removeEffect = useCallback((effectId: string) => {
    setEffects(prev => {
      const { [effectId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const getEffectForElement = useCallback((elementId: string) => {
    // Find effect by element ID pattern (elementId-effectType)
    const effectId = Object.keys(effects).find(id => id.startsWith(`${elementId}-`));
    return effectId ? effects[effectId] : undefined;
  }, [effects]);

  return (
    <ThemeEffectContext.Provider 
      value={{ 
        effects, 
        addEffect, 
        removeEffect, 
        getEffectForElement 
      }}
    >
      {children}
    </ThemeEffectContext.Provider>
  );
}
