
import React from "react";
import { cn } from "@/lib/utils";
import { Command, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  // Glitch animation for text
  const glitchVariants = {
    normal: { x: 0 },
    glitch: {
      x: [0, -2, 3, -1, 0],
      transition: { 
        duration: 0.3,
        repeat: Infinity,
        repeatType: "mirror" as const,
        repeatDelay: 5
      }
    }
  };

  return (
    <div className={cn(
      "p-4 border-b border-primary/20 bg-primary/5 relative overflow-hidden",
      collapsed ? "p-2" : "",
      "cyber-animated-bg mad-scientist-glow"
    )}>
      <div className="flex items-center space-x-2 relative z-10">
        {collapsed ? (
          <div className="flex justify-center w-full">
            <motion.div
              whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
              className="cyber-nav-item p-1.5 rounded-full border border-primary/30"
            >
              <Zap className="h-5 w-5 text-primary" />
            </motion.div>
          </div>
        ) : (
          <>
            <Command className="h-5 w-5 text-primary" />
            <motion.h2 
              className="font-heading text-primary cyber-text-glow whitespace-nowrap"
              initial="normal"
              whileHover="glitch"
              variants={glitchVariants}
              data-text="Admin Control"
            >
              Admin Control
            </motion.h2>
          </>
        )}
      </div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[30%] left-[40%] w-0.5 h-0.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[70%] left-[20%] w-0.5 h-0.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[40%] left-[80%] w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[60%] left-[60%] w-0.5 h-0.5 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
      </div>
    </div>
  );
};
