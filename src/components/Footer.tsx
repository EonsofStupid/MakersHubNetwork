import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/stores/theme/store";
import { ThemeInfoPopup } from "@/components/theme/ThemeInfoPopup";

export function Footer() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setTheme } = useThemeStore();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 w-full z-40 perspective-1000 ${
        isLoaded ? "animate-morph-header" : ""
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-background/20 backdrop-blur-xl" />
      
      <div className="relative z-10">
        <div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ "--stream-duration": "15s" } as React.CSSProperties}
        >
          {/* Data Streams */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-full bg-primary/20 animate-stream-vertical"
              style={{
                left: `${20 * (i + 1)}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-primary/20 animate-stream-horizontal"
              style={{
                top: `${33 * (i + 1)}%`,
                animationDelay: `${i * 0.7}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4">
          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Footer content grid */}
            </div>
            
            <div className="border-t border-primary/30 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-sm text-muted-foreground">
                  © 2025 MakersImpulse. All rights reserved.
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  className="relative group mad-scientist-hover transition-all duration-300 hover:bg-primary/10"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Terminal className="w-4 h-4 mr-2 text-primary group-hover:animate-pulse relative z-10" />
                  <span className="text-sm group-hover:text-primary transition-colors">Theme Info</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </Button>

                <AnimatePresence mode="wait">
                  {isDialogOpen && (
                    <ThemeInfoPopup 
                      open={isDialogOpen} 
                      onOpenChange={setIsDialogOpen}
                    />
                  )}
                </AnimatePresence>

                <p className="text-sm text-muted-foreground">
                  Designed by{" "}
                  <a
                    href="https://angrygaming.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary transition-colors duration-300 mad-scientist-hover"
                  >
                    onemanwho Designs
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}