
import { useEffect, useState } from 'react';
import { initializeTheme } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setTheme } = useThemeStore();
  const { toast } = useToast();

  useEffect(() => {
    async function initialize() {
      try {
        const themeId = await initializeTheme();
        
        if (themeId) {
          await setTheme(themeId);
          console.log('Theme initialized successfully with ID:', themeId);
        } else {
          console.warn('Failed to initialize theme, falling back to default styles');
        }
      } catch (error) {
        console.error('Error initializing theme:', error);
        toast({
          title: 'Theme Error',
          description: 'Failed to load theme. Using default styling.',
          variant: 'destructive',
        });
      } finally {
        setIsInitialized(true);
      }
    }
    
    initialize();
  }, [setTheme, toast]);

  // Optional: Show loading state while theme is initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="space-y-4 text-center">
          <div className="text-primary animate-pulse text-2xl font-bold">Loading Theme...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
