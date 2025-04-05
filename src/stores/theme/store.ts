
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';

const logger = getLogger('ThemeStore', { category: LogCategory.THEME });

export interface ThemeComponentStyle {
  component_name: string;
  styles: Record<string, any>;
}

interface ThemeState {
  currentTheme: string;
  themeTokens: Record<string, any>;
  siteComponents: ThemeComponentStyle[];
  isLoading: boolean;
  error: Error | null;
  setTheme: (theme: string) => void;
  setThemeTokens: (tokens: Record<string, any>) => void;
  loadSiteComponents: () => Promise<void>;
  hydrateTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: '',
      themeTokens: {},
      siteComponents: [],
      isLoading: false,
      error: null,
      
      setTheme: (theme) => {
        logger.debug(`Setting theme to: ${theme}`);
        set({ currentTheme: theme });
      },
      
      setThemeTokens: (tokens) => {
        logger.debug('Setting theme tokens', { details: { tokenCount: Object.keys(tokens).length } });
        set({ themeTokens: tokens });
      },
      
      hydrateTheme: async () => {
        logger.debug('Hydrating theme from store');
        // This is a placeholder implementation
        return Promise.resolve();
      },
      
      loadSiteComponents: async () => {
        try {
          set({ isLoading: true });
          logger.debug('Loading site components');
          
          // This would be replaced with an actual API call in a complete implementation
          // For now, we'll use mock data
          const mockComponents: ThemeComponentStyle[] = [
            {
              component_name: 'MainNav',
              styles: {
                container: {
                  base: 'fixed top-0 w-full z-50 transition-all duration-300',
                  animated: 'animate-morph-header shadow-[0_4px_30px_rgba(0,0,0,0.1),inset_0_0_30px_rgba(var(--color-primary),0.1)]'
                },
                header: 'bg-background/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(var(--color-primary),0.2)] border-b border-primary/30',
                dataStream: 'relative overflow-hidden',
                dataStreamEffect: 'mainnav-data-stream',
                glitchParticles: 'mainnav-glitch-particles',
              }
            },
            {
              component_name: 'PageTitle',
              styles: {
                title: "text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative",
                gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mad-scientist-hover"
              }
            },
            {
              component_name: 'ActionButtons',
              styles: {
                buildCta: "cyber-card inline-flex h-12 items-center justify-center rounded-md bg-primary/20 px-8 text-sm font-medium text-primary-foreground shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-300 hover:scale-105 hover:bg-primary/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden",
                browseCta: "glass-morphism inline-flex h-12 items-center justify-center rounded-md border border-primary/30 bg-background/30 backdrop-blur-xl px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent/10 hover:text-accent-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden",
                communityCta: "neo-blur inline-flex h-12 items-center justify-center rounded-md border border-secondary/30 bg-background/30 backdrop-blur-xl px-8 text-sm font-medium transition-colors hover:bg-secondary/10 hover:text-secondary-foreground hover:border-secondary/50 hover:shadow-[0_0_15px_rgba(255,45,110,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30 disabled:pointer-events-none disabled:opacity-50 group relative overflow-hidden"
              }
            },
            {
              component_name: 'SubscriptionForm',
              styles: {
                container: "subscribe-banner cyber-card p-4 md:p-6 max-w-xl mx-auto my-8 relative overflow-hidden",
                gradient: "absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10"
              }
            }
          ];
          
          await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
          
          set({
            siteComponents: mockComponents,
            isLoading: false
          });
          
          logger.info('Site components loaded', { 
            details: { componentCount: mockComponents.length } 
          });
        } catch (error: unknown) {
          const err = error instanceof Error ? error : new Error(String(error));
          logger.error('Failed to load site components', { 
            details: { message: err.message } 
          });
          set({ error: err, isLoading: false });
        }
      },
    }),
    {
      name: 'theme-store',
    }
  )
);
