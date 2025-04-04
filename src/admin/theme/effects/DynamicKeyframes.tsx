
import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { defaultImpulseTokens } from '../impulse/tokens';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { themeRegistry } from '../ThemeRegistry';

export function DynamicKeyframes() {
  const { currentTheme } = useThemeStore();
  const [keyframesStyles, setKeyframesStyles] = useState('');
  const logger = useLogger('DynamicKeyframes', { category: LogCategory.THEME });

  useEffect(() => {
    try {
      // Get theme - first from registry, then currentTheme, fall back to default tokens
      const activeTheme = themeRegistry.getActiveTheme() || 
                         (currentTheme?.design_tokens?.admin as any) || 
                         defaultImpulseTokens;
      
      const primaryColor = activeTheme?.colors?.primary || defaultImpulseTokens.colors.primary;
      const secondaryColor = activeTheme?.colors?.secondary || defaultImpulseTokens.colors.secondary;
      
      // Define keyframes
      const styles = `
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px ${primaryColor}40; }
          50% { box-shadow: 0 0 20px ${primaryColor}80; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes scan-line {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 100%; }
        }
        
        @keyframes primary-glow {
          0%, 100% { text-shadow: 0 0 10px ${primaryColor}80; }
          50% { text-shadow: 0 0 20px ${primaryColor}, 0 0 30px ${primaryColor}80; }
        }
        
        @keyframes secondary-glow {
          0%, 100% { text-shadow: 0 0 10px ${secondaryColor}80; }
          50% { text-shadow: 0 0 20px ${secondaryColor}, 0 0 30px ${secondaryColor}80; }
        }
      `;
      
      setKeyframesStyles(styles);
      logger.debug('Dynamic keyframes generated');
    } catch (error) {
      logger.error('Failed to generate dynamic keyframes', { 
        details: { error: String(error) } 
      });
    }
  }, [currentTheme, logger]);

  // Add the keyframes to the document
  return (
    <style id="dynamic-keyframes">
      {keyframesStyles}
    </style>
  );
}
