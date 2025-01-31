import { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface DesktopLayoutProps {
  children: ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      "bg-background text-foreground",
      "transition-colors duration-300"
    )}>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}