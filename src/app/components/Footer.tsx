
import React from 'react';
import { cn } from '@/shared/utils/cn';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "border-t border-border/10",
      "py-6 md:py-0",
      "backdrop-blur-md bg-background/50"
    )}>
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          &copy; {currentYear} Impulse 3D. All rights reserved.
        </p>
        
        <div className="flex items-center gap-4">
          <a 
            href="/terms" 
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Terms
          </a>
          <a 
            href="/privacy" 
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy
          </a>
          <a 
            href="/contact" 
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
