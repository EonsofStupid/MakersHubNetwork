
import React from 'react';
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function PageLayout({
  title,
  description,
  children,
  className,
  fullWidth = false,
}: PageLayoutProps) {
  return (
    <div className={cn(
      "flex flex-col",
      fullWidth ? "w-full" : "container px-4 py-6",
      className
    )}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
