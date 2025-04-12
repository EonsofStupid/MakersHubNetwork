
import React from "react";
import { cn } from "@/lib/utils";

interface CyberTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glitch" | "glow";
}

export function CyberText({
  children,
  className,
  variant = "default"
}: CyberTextProps) {
  if (variant === "glitch") {
    return (
      <span className={cn("relative inline-block", className)}>
        {children}
        <span 
          className="absolute -inset-x-1 top-0 bottom-0 bg-transparent text-primary/70 left-[2px] skew-x-3" 
          style={{ clipPath: "polygon(5% 0, 100% 0, 100% 60%, 20% 100%)" }}
          aria-hidden="true"
        >
          {children}
        </span>
        <span 
          className="absolute -inset-x-1 top-0 bottom-0 bg-transparent text-secondary/70 left-[-2px] skew-x-[-3deg]" 
          style={{ clipPath: "polygon(0 30%, 100% 0, 100% 100%, 0 100%)" }}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    );
  }
  
  if (variant === "glow") {
    return (
      <span className={cn(
        "relative inline-block cyber-glow", 
        "after:absolute after:inset-0 after:bg-gradient-to-r after:from-primary/0 after:via-primary/30 after:to-primary/0 after:blur-xl after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500",
        className
      )}>
        {children}
      </span>
    );
  }
  
  return <span className={className}>{children}</span>;
}
