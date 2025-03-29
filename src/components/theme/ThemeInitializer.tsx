
import { useEffect, useState } from 'react';
import { ensureDefaultTheme } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setTheme, isLoading } = useThemeStore();
  const { toast } = useToast();

  useEffect(() => {
    async function initialize() {
      try {
        // First, ensure the default theme exists in the database
        const themeId = await ensureDefaultTheme();
        
        if (themeId) {
          // Then sync CSS using the ensureDefaultTheme's built-in sync capability
          await setTheme(themeId);
          console.log('Theme initialized successfully with ID:', themeId);
        } else {
          console.warn('Failed to initialize theme, falling back to default styles');
          toast({
            title: 'Theme Warning',
            description: 'Could not find or create theme. Using default styling.',
            variant: "destructive", // Using a valid variant
          });
        }
      } catch (error) {
        console.error('Error initializing theme:', error);
        toast({
          title: 'Theme Error',
          description: 'Failed to load theme. Using default styling.',
          variant: "destructive",
        });
      } finally {
        setIsInitialized(true);
      }
    }
    
    initialize();
  }, [setTheme, toast]);

  // Optional: Show loading state while theme is initializing
  if (!isInitialized || isLoading) {
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
