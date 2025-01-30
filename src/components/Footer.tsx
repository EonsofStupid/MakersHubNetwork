import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/stores/theme/store";
import { AdaptivePopup } from "@/components/ui/adaptive-popup/AdaptivePopup";
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
      className={`fixed bottom-0 left-0 right-0 w-full z-40 transition-all duration-[1.5s] ease-in-out ${
        isLoaded ? "bg-background/20 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Other footer content */}
          </div>
          
          <div className="border-t border-primary/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-muted-foreground">
                © 2025 MakersImpulse. All rights reserved.
              </p>

              <Button
                variant="ghost"
                size="sm"
                className="relative group transition-all duration-300 hover:bg-primary/10"
                onClick={() => setIsDialogOpen(true)}
              >
                <Terminal className="w-4 h-4 mr-2 text-primary group-hover:animate-pulse relative z-10" />
                <span className="text-sm group-hover:text-primary transition-colors">Theme Info</span>
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
                  className="text-primary hover:text-secondary transition-colors duration-300"
                >
                  onemanwho Designs
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
