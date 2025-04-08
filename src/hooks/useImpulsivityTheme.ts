
import { useCallback, useEffect, useState } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { safeSSR } from '@/lib/utils/safeSSR';

interface ImpulsivityThemeConfig {
  effectColor: string;
  effectSecondary: string;
  effectTertiary: string;
  spotlightSize: string;
  spotlightColor: string;
  enableAnimations: boolean;
}

const defaultConfig: ImpulsivityThemeConfig = {
  effectColor: '#00F0FF',
  effectSecondary: '#FF2D6E',
  effectTertiary: '#8B5CF6',
  spotlightSize: '300px',
  spotlightColor: 'rgba(0, 240, 255, 0.03)',
  enableAnimations: true
};

export function useImpulsivityTheme() {
  const [config, setConfig] = useState<ImpulsivityThemeConfig>(defaultConfig);
  const logger = useLogger('useImpulsivityTheme', LogCategory.UI);

  // Initialize on first load - with safe SSR wrapper to prevent hydration mismatch
  useEffect(() => {
    try {
      // Try to load from local storage if available
      safeSSR(() => {
        const storedConfig = localStorage.getItem('impulsivity-theme');
        if (storedConfig) {
          setConfig({ ...defaultConfig, ...JSON.parse(storedConfig) });
        }
      }, () => {});
      
      logger.debug('Impulsivity theme initialized');
    } catch (error) {
      logger.error('Failed to initialize impulsivity theme', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  }, [logger]);

  // Update a specific config value and persist
  const updateConfig = useCallback((key: keyof ImpulsivityThemeConfig, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      safeSSR(() => {
        localStorage.setItem('impulsivity-theme', JSON.stringify(newConfig));
      }, () => {});
      return newConfig;
    });
  }, []);

  // Apply theme to main site
  const applyToMainSite = useCallback(() => {
    try {
      const root = document.documentElement;
      
      // Apply theme variables to CSS
      root.style.setProperty('--site-effect-color', config.effectColor);
      root.style.setProperty('--site-effect-secondary', config.effectSecondary);
      root.style.setProperty('--site-effect-tertiary', config.effectTertiary);
      root.style.setProperty('--site-spotlight-size', config.spotlightSize);
      root.style.setProperty('--site-spotlight-color', config.spotlightColor);
      
      // Add/remove animation class based on config
      if (config.enableAnimations) {
        document.body.classList.add('enable-animations');
      } else {
        document.body.classList.remove('enable-animations');
      }
      
      logger.debug('Applied impulsivity theme to main site');
      return true;
    } catch (error) {
      logger.error('Failed to apply impulsivity theme', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      return false;
    }
  }, [config, logger]);

  return {
    config,
    updateConfig,
    applyToMainSite,
    setEnableAnimations: (value: boolean) => updateConfig('enableAnimations', value),
    setEffectColor: (color: string) => updateConfig('effectColor', color),
    setEffectSecondary: (color: string) => updateConfig('effectSecondary', color)
  };
}
