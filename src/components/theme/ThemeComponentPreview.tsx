import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ThemeComponent } from "@/types/theme";
import { Button } from "@/components/ui/button";

interface ThemeComponentPreviewProps {
  components: ThemeComponent[];
}

export function ThemeComponentPreview({ components }: ThemeComponentPreviewProps) {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {components.map((component) => (
          <Button
            key={component.id}
            variant="ghost"
            size="sm"
            className={cn(
              "relative",
              activeComponent === component.component_name && "text-primary",
              "mad-scientist-hover"
            )}
            onClick={() => setActiveComponent(
              activeComponent === component.component_name ? null : component.component_name
            )}
          >
            {component.component_name}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeComponent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "p-4 rounded-lg",
              "bg-background/40 backdrop-blur-sm",
              "border border-primary/20"
            )}
          >
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(
                components.find(c => c.component_name === activeComponent)?.styles,
                null,
                2
              )}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}