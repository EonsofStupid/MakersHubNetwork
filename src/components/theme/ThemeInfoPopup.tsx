import { useState, useEffect } from "react";
import { useThemeStore } from "@/stores/theme/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Maximize2, Sparkles, Wand2, Palette, Box, Zap, Info } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeComponentPreview } from "./ThemeComponentPreview";
import { EffectsPreview } from "./EffectsPreview";
import { ThemeColorSystem } from "./ThemeColorSystem";
import { ThemeDataStream } from "./ThemeDataStream";
import type { DesignTokens, ComponentTokens } from "@/types/theme";

interface ThemeInfoPopupProps {
  onClose?: () => void;
}

export function ThemeInfoPopup({ onClose }: ThemeInfoPopupProps) {
  const { currentTheme, isLoading, error, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("info");
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [previewEffect, setPreviewEffect] = useState<string | null>(null);

  useEffect(() => {
    if (!hasAttemptedLoad) {
      console.log("ThemeInfoPopup mounted, fetching default theme...");
      setTheme("");
      setHasAttemptedLoad(true);
    }
  }, [setTheme, hasAttemptedLoad]);

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="p-6 text-center bg-background/20 backdrop-blur-xl border border-destructive/20 rounded-lg shadow-lg"
      >
        <p className="text-destructive">Error loading theme: {error.message}</p>
        {onClose && (
          <Button onClick={onClose} variant="ghost" className="mt-4">
            Close
          </Button>
        )}
      </motion.div>
    );
  }

  if (isLoading || !currentTheme) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 text-center bg-background/20 backdrop-blur-xl rounded-lg shadow-lg"
      >
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-muted-foreground animate-pulse">Loading theme data...</p>
      </motion.div>
    );
  }

  const TextWithPopup = ({ text, label }: { text: string; label: string }) => (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group relative cursor-pointer">
          <p className="truncate text-sm text-muted-foreground">
            {label}: {text}
          </p>
          <Maximize2 className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
        </div>
      </DialogTrigger>
      <DialogContent className="bg-background/95 backdrop-blur-xl border border-primary/20">
        <ScrollArea className="h-[300px] w-full p-4">
          <h4 className="font-medium mb-2">{label}</h4>
          <pre className="whitespace-pre-wrap break-words text-sm">{text}</pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, rotateX: "15deg" }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: "0deg",
        transition: {
          duration: 0.5,
          ease: [0.19, 1.0, 0.22, 1.0]
        }
      }}
      exit={{ opacity: 0, y: -20, rotateX: "-15deg" }}
      className="w-[800px] max-w-[90vw] rounded-lg bg-background/20 backdrop-blur-xl p-6 border border-primary/20 shadow-[0_0_15px_rgba(0,240,255,0.1)] animate-morph-header perspective-1000"
    >
      <ThemeDataStream className="opacity-10" />
      
      <Tabs defaultValue="info" className="w-full relative z-10" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-6 bg-background/40 border border-primary/20">
          <TabsTrigger value="info" className="data-[state=active]:bg-primary/20">
            <Info className="w-4 h-4 mr-2" />
            Info
          </TabsTrigger>
          <TabsTrigger value="colors" className="data-[state=active]:bg-primary/20">
            <Palette className="w-4 h-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="components" className="data-[state=active]:bg-primary/20">
            <Box className="w-4 h-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger value="effects" className="data-[state=active]:bg-primary/20">
            <Zap className="w-4 h-4 mr-2" />
            Effects
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="info" className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-primary glitch">{currentTheme.name}</h3>
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
                <TextWithPopup text={currentTheme.description} label="Description" />
              )}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Details</h4>
                  <div className="space-y-1">
                    <TextWithPopup 
                      text={currentTheme.cache_key || 'Not generated'} 
                      label="Cache Key" 
                    />
                    <TextWithPopup 
                      text={currentTheme.parent_theme_id || 'None'} 
                      label="Parent Theme" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Timestamps</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Created: {new Date(currentTheme.created_at || '').toLocaleDateString()}</p>
                    <p>Updated: {new Date(currentTheme.updated_at || '').toLocaleDateString()}</p>
                    {currentTheme.published_at && (
                      <p>Published: {new Date(currentTheme.published_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              <ThemeColorSystem tokens={currentTheme.design_tokens || {}} />
            </TabsContent>

            <TabsContent value="components" className="space-y-4">
              <ThemeComponentPreview 
                componentTokens={currentTheme.component_tokens || []} 
              />
            </TabsContent>

            <TabsContent value="effects" className="space-y-4">
              <EffectsPreview />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}
