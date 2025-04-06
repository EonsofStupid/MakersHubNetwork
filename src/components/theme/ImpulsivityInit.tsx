
import { useEffect } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface ImpulsivityInitProps {
  children: React.ReactNode;
}

export function ImpulsivityInit({ children }: ImpulsivityInitProps) {
  const logger = useLogger('ImpulsivityInit', LogCategory.UI);
  
  // Apply theme CSS variables directly for immediate visual consistency
  useEffect(() => {
    try {
      // Set essential CSS variables directly
      const rootElement = document.documentElement;
      
      // Primary theme colors
      rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
      rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
      
      // Effect colors as direct hex (most compatible approach)
      rootElement.style.setProperty('--site-effect-color', '#00F0FF');
      rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
      rootElement.style.setProperty('--site-effect-tertiary', '#8B5CF6');
      
      // Background and foreground colors
      rootElement.style.setProperty('--site-background', '228 47% 8%');
      rootElement.style.setProperty('--site-foreground', '210 40% 98%');
      rootElement.style.setProperty('--site-card', '228 47% 11%');
      rootElement.style.setProperty('--site-card-foreground', '210 40% 98%');
      
      // Standard Tailwind CSS variables
      rootElement.style.setProperty('--background', 'hsl(228 47% 8%)');
      rootElement.style.setProperty('--foreground', 'hsl(210 40% 98%)');
      rootElement.style.setProperty('--card', 'hsl(228 47% 11%)');
      rootElement.style.setProperty('--card-foreground', 'hsl(210 40% 98%)');
      rootElement.style.setProperty('--primary', 'hsl(186 100% 50%)');
      rootElement.style.setProperty('--primary-foreground', 'hsl(210 40% 98%)');
      rootElement.style.setProperty('--secondary', 'hsl(334 100% 59%)');
      rootElement.style.setProperty('--secondary-foreground', 'hsl(210 40% 98%)');
      
      // Fallback direct hex values
      rootElement.style.setProperty('--impulse-primary', '#00F0FF');
      rootElement.style.setProperty('--impulse-secondary', '#FF2D6E');
      rootElement.style.setProperty('--impulse-bg-main', '#080F1E');
      rootElement.style.setProperty('--impulse-text-primary', '#F9FAFB');
      
      // Set theme class on root elements
      rootElement.classList.add('theme-impulsivity');
      document.body.classList.add('theme-impulsivity-body');
      
      logger.info('Applied direct CSS variables for Impulsivity theme');
    } catch (error) {
      logger.error('Error applying immediate styles', { 
        details: {
          errorMessage: error instanceof Error ? error.message : String(error)
        }
      });
    }
  }, [logger]);

  return <>{children}</>;
}

export default ImpulsivityInit;
