
import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/shared/types/shared.types";

interface AdminLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  title?: string;
}

/**
 * Base Admin Layout
 * 
 * Provides consistent structure for admin pages
 */
export function AdminLayout({
  children,
  fullWidth = false,
  className = '',
  title
}: AdminLayoutProps) {
  const logger = useLogger("AdminLayout", LogCategory.ADMIN);
  
  return (
    <div className={cn(
      "min-h-screen bg-background/30 backdrop-blur-sm",
      fullWidth ? "px-4" : "container px-4 py-4",
      className
    )}>
      {title && (
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
      )}
      {children}
    </div>
  );
}
