import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import type { ThemeToken } from "@/types/theme";

interface ThemeColorSystemProps {
  tokens: ThemeToken[];
}

export function ThemeColorSystem({ tokens }: ThemeColorSystemProps) {
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  const copyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedColor(value);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Group tokens by their category for better organization
  const colorGroups = tokens.reduce((acc, token) => {
    const group = token.token_name.split('-')[0] || 'base';
    if (!acc[group]) acc[group] = [];
    acc[group].push(token);
    return acc;
  }, {} as Record<string, ThemeToken[]>);

  return (
    <div className="space-y-8">
      {Object.entries(colorGroups).map(([groupName, groupTokens]) => (
        <div key={groupName} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize text-primary">{groupName} Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupTokens.map((token) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "relative p-4 rounded-lg",
                  "bg-background/40 backdrop-blur-sm",
                  "border border-primary/20",
                  "group cursor-pointer",
                  "transition-all duration-300"
                )}
                onClick={() => setActiveColor(activeColor === token.token_name ? null : token.token_name)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg",
                      "border-2 border-primary/20",
                      "transition-shadow duration-300",
                      "group-hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                    )}
                    style={{ backgroundColor: token.token_value }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{token.token_name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground">{token.token_value}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(token.token_value);
                        }}
                        className="p-1 rounded-md hover:bg-primary/20 transition-colors"
                      >
                        {copiedColor === token.token_value ? (
                          <Check className="w-3 h-3 text-primary" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {activeColor === token.token_name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
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
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}