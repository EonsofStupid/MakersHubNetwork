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
    // Delay just so you can see the morph
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 w-full z-40"
      // perspective-1000 removed unless truly needed
    >
      {/* Outer container that gets clipped */}
      <div
        className={`relative overflow-hidden 
          ${isLoaded ? "animate-footer-morph" : ""}`}
      >
        {/* The actual gradient background or shape filling */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-background/20 backdrop-blur-xl" />

        {/* The content */}
        <div className="relative z-10">
          <div className="container mx-auto px-4">
            <div className="py-7">
              {/* ---- FOOTER GRIDS / QUICK LINKS ETC. ---- */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Quick Links */}
                <div>
                  <h4 className="text-primary font-heading text-lg mb-3">
                    Quick Links
                  </h4>
                  <ul className="space-y-1.5">
                    {["Explore", "Create", "Learn", "Connect"].map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* ... the rest of your columns ... */}
              </div>

              <div className="border-t border-primary/30 pt-6">
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
                    <Terminal className="w-4 h-4 mr-2 text-primary group-hover:animate-pulse" />
                    <span className="text-sm group-hover:text-primary transition-colors">
                      Theme Info
                    </span>
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
                      className="text-primary hover:text-secondary transition-colors mad-scientist-hover"
                    >
                      onemanwho Designs
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Streams (if you like) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ "--stream-duration": "15s" } as React.CSSProperties}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute w-px h-full bg-primary/20 animate-stream-vertical"
                style={{
                  left: `${20 * (i + 1)}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full h-px bg-primary/20 animate-stream-horizontal"
                style={{
                  top: `${33 * (i + 1)}%`,
                  animationDelay: `${i * 0.7}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
