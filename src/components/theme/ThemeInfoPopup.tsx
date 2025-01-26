import { useState, useEffect } from "react";
import { useThemeStore } from "@/stores/theme/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ThemeInfoPopupProps {
  onClose?: () => void;
}

export function ThemeInfoPopup({ onClose }: ThemeInfoPopupProps) {
  const { currentTheme, isLoading, error, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("info");

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
    <div className="w-[800px] max-w-[90vw] rounded-lg bg-background/20 backdrop-blur-xl p-6">
      <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-primary">{currentTheme.name}</h3>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
                  v{currentTheme.version}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-secondary/20 text-secondary border border-secondary/30">
                  {currentTheme.status}
                </span>
                {currentTheme.is_default && (
                  <span className="px-2 py-1 text-xs rounded-full bg-accent/20 text-accent border border-accent/30">
                    Default Theme
                  </span>
                )}
              </div>
            </div>
          </div>

          {currentTheme.description && (
            <p className="text-sm text-muted-foreground mt-4">{currentTheme.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Details</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Created: {new Date(currentTheme.created_at || '').toLocaleDateString()}</p>
                <p>Updated: {new Date(currentTheme.updated_at || '').toLocaleDateString()}</p>
                {currentTheme.published_at && (
                  <p>Published: {new Date(currentTheme.published_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Configuration</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Cache Key: {currentTheme.cache_key || 'Not generated'}</p>
                <p>Parent Theme: {currentTheme.parent_theme_id || 'None'}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">Design Tokens</h4>
            <pre className="p-4 rounded-lg bg-muted/50 text-xs overflow-auto max-h-[400px]">
              {JSON.stringify(currentTheme.design_tokens, null, 2)}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">Component Tokens</h4>
            <pre className="p-4 rounded-lg bg-muted/50 text-xs overflow-auto max-h-[400px]">
              {JSON.stringify(currentTheme.component_tokens, null, 2)}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="variants" className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">Composition Rules</h4>
            <pre className="p-4 rounded-lg bg-muted/50 text-xs overflow-auto max-h-[400px]">
              {JSON.stringify(currentTheme.composition_rules, null, 2)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}