import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ThemeToken } from "@/types/theme";

interface ThemeColorSystemProps {
  tokens: ThemeToken[];
}

export function ThemeColorSystem({ tokens }: ThemeColorSystemProps) {
  const [activeColor, setActiveColor] = useState<string | null>(null);
  
  // Ensure tokens is an array and handle undefined/null case
  const safeTokens = Array.isArray(tokens) ? tokens : [];
  
  const colorTokens = safeTokens.filter(token => 
    token.category === 'colors' || token.token_name.includes('color')
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {colorTokens.map((token) => (
        <motion.div
          key={token.id}
          whileHover={{ scale: 1.05, rotateY: 15 }}
          className={cn(
            "relative p-4 rounded-lg",
            "bg-background/40 backdrop-blur-sm",
            "border border-primary/20",
            "group cursor-pointer",
            "transition-all duration-300"
          )}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
          onClick={() => setActiveColor(activeColor === token.token_name || token.name ? null : token.token_name)}
        >
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full",
                "border-2 border-primary/20",
                "transition-shadow duration-300",
                "group-hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]"
              )}
              style={{ backgroundColor: token.token_value }}
            />
            <div>
              <p className="text-sm font-medium">{token.token_name || token.name}</p>
              <p className="text-xs text-muted-foreground">{token.token_value}</p>
            </div>
          </div>
          
          {activeColor === token.token_name && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 text-xs space-y-2"
            >
              {token.description && (
                <p className="text-muted-foreground">{token.description}</p>
              )}
              {token.fallback_value && (
                <p className="text-muted-foreground">
                  Fallback: {token.fallback_value}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
