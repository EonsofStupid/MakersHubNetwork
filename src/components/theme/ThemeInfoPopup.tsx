import { useState, useEffect } from "react";
import { useThemeStore } from "@/stores/theme/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ThemeInfoPopupProps {
  onClose?: () => void;
}

export function ThemeInfoPopup({ onClose }: ThemeInfoPopupProps) {
  const { currentTheme, isLoading, error, setTheme } = useThemeStore();

  useEffect(() => {
    console.log("ThemeInfoPopup mounted, fetching theme...");
    setTheme();
  }, [setTheme]);

  if (error) {
    console.error("Theme error:", error);
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Error loading theme: {error.message}</p>
        {onClose && (
          <Button onClick={onClose} variant="ghost" className="mt-4">
            Close
          </Button>
        )}
      </div>
    );
  }

  if (isLoading || !currentTheme) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-muted-foreground">Loading theme data...</p>
      </div>
    );
  }

  console.log("Rendering theme data:", currentTheme);

  return (
    <div className="w-[600px] max-w-[90vw] rounded-lg bg-background/20 backdrop-blur-xl p-6">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-primary">{currentTheme.name}</h3>
        
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
            v{currentTheme.version}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-secondary/20 text-secondary border border-secondary/30">
            {currentTheme.status}
          </span>
        </div>

        {currentTheme.description && (
          <p className="text-sm text-muted-foreground">{currentTheme.description}</p>
        )}

        <div className="text-sm space-y-2">
          <p>Created: {new Date(currentTheme.created_at || '').toLocaleDateString()}</p>
          <p>Updated: {new Date(currentTheme.updated_at || '').toLocaleDateString()}</p>
          {currentTheme.published_at && (
            <p>Published: {new Date(currentTheme.published_at).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}