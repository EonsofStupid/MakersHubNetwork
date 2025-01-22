import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ThemeInfoPopup } from "@/components/theme/ThemeInfoPopup";
import { Terminal } from "lucide-react";

export function Footer() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  const handleThemeInfoClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 w-full z-40 transition-all duration-[1.5s] ease-in-out",
        isLoaded
          ? "bg-background/20 backdrop-blur-xl shadow-[0_-8px_32px_0_rgba(0,240,255,0.2)] border-t border-primary/30 before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/5 before:to-transparent before:pointer-events-none"
          : "bg-transparent",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:via-secondary/10 before:to-primary/10 before:opacity-0 before:transition-opacity before:duration-1000",
        isLoaded && [
          "before:opacity-100",
          "shadow-[0_-4px_30px_rgba(0,0,0,0.1),inset_0_0_30px_rgba(0,240,255,0.1)]",
          "after:content-[''] after:absolute after:inset-0 after:border-2 after:border-primary/20 after:rounded-t-lg after:transition-all after:duration-1000"
        ]
      )}
      style={{
        transform: isLoaded ? "perspective(1000px) rotateX(1deg)" : "none",
        clipPath: "polygon(0 100%, 100% 100%, 98% 0%, 2% 0%)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Footer links sections */}
          </div>
          
          <div className="border-t border-primary/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-muted-foreground">
                © 2025 MakersImpulse. All rights reserved.
              </p>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleThemeInfoClick}
                    className={cn(
                      "relative group px-4 py-2",
                      "bg-background/20 backdrop-blur-xl",
                      "border border-primary/30",
                      "hover:bg-primary/5",
                      "before:absolute before:inset-0",
                      "before:bg-gradient-to-r before:from-primary/10 before:via-secondary/10 before:to-primary/10",
                      "before:opacity-0 before:transition-opacity before:duration-300",
                      "group-hover:before:opacity-100",
                      "after:absolute after:inset-0",
                      "after:border-2 after:border-primary/20",
                      "after:scale-x-0 after:transition-transform after:duration-300",
                      "group-hover:after:scale-x-100",
                      "mad-scientist-hover"
                    )}
                  >
                    <Terminal className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm">Theme Info</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-transparent border-none">
                  <ThemeInfoPopup />
                </DialogContent>
              </Dialog>

              <p className="text-sm text-muted-foreground">
                Designed by{" "}
                <a
                  href="https://onemanwho.design"
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
