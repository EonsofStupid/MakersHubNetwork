
import { ReactNode, useEffect } from "react";
import { useToast } from "@/ui/hooks/use-toast";
import { useThemeStore } from "@/stores/theme/store";
import { ThemeLoadingState } from "./info/ThemeLoadingState";
import { ThemeErrorState } from "./info/ThemeErrorState";

interface ThemeInitializerProps {
  children: ReactNode;
  defaultTheme?: string;
}

export function ThemeInitializer({ children, defaultTheme = "Impulsivity" }: ThemeInitializerProps) {
  const { toast } = useToast();
  const { isLoading, error, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme
    const initTheme = async () => {
      try {
        await setTheme(defaultTheme);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        toast({
          title: "Theme Error",
          description: errorMessage,
          variant: "destructive",
        });
        console.error("Theme initialization failed:", errorMessage);
      }
    };
    
    initTheme();
  }, [defaultTheme, setTheme, toast]);

  if (isLoading) {
    return <ThemeLoadingState />;
  }

  if (error) {
    return (
      <ThemeErrorState 
        message="Theme Error" 
        subMessage={error.message} 
        onRetry={() => setTheme(defaultTheme)}
      />
    );
  }

  return children;
}
