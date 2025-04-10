
import React from "react";
import { cn } from "@/lib/utils";
import { useSiteTheme } from "./SiteThemeProvider";

interface ThemeDataStreamProps {
  className?: string;
}

export const ThemeDataStream: React.FC<ThemeDataStreamProps> = ({ className }) => {
  const { variables } = useSiteTheme();
  
  return (
    <div 
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none overflow-hidden",
        className
      )}
    >
      {/* Data stream visual effect */}
      <div className="absolute inset-0 w-full h-full">
        <div className="data-stream-effect"></div>
        <div className="data-particles"></div>
      </div>
    </div>
  );
};
