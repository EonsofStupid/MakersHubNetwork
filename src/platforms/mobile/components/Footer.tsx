import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ThemeInfoPopup } from "@/components/theme/ThemeInfoPopup";
import { Terminal } from "lucide-react";
import { useThemeStore } from "@/stores/theme/store";

export function Footer() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setTheme } = useThemeStore();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  useEffect(() => {
    if (isDialogOpen) {
      setTheme("");
    }
  }, [isDialogOpen, setTheme]);

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 w-full z-40 transition-all duration-[1.5s] ease-in-out",
        isLoaded
          ? "bg-background/20 backdrop-blur-xl shadow-[0_-8px_32px_0_rgba(0,240,255,0.2)] border-t border-primary/30"
          : "bg-transparent",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:via-secondary/10 before:to-primary/10 before:opacity-0 before:transition-opacity before:duration-1000",
        isLoaded && "before:opacity-100"
      )}
    >
      <div className="container mx-auto px-2">
        <div className="py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold mb-2">Resources</h3>
              <ul className="space-y-1">
                <li><Link to="/docs" className="text-xs text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="/guides" className="text-xs text-muted-foreground hover:text-primary transition-colors">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-2">Community</h3>
              <ul className="space-y-1">
                <li><Link to="/forum" className="text-xs text-muted-foreground hover:text-primary transition-colors">Forum</Link></li>
                <li><Link to="/discord" className="text-xs text-muted-foreground hover:text-primary transition-colors">Discord</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary/30 pt-4">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xs text-muted-foreground">
                © 2025 MakersImpulse
              </p>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="relative group overflow-hidden px-3 py-1 bg-background/20 backdrop-blur-xl border border-primary/30 hover:bg-primary/5 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-primary/30 focus:outline-none"
                  >
                    <Terminal className="w-3 h-3 mr-1 text-primary group-hover:animate-pulse relative z-10" />
                    <span className="text-xs group-hover:text-primary transition-colors relative z-10">Theme</span>
                  </Button>
                </DialogTrigger>
                <DialogContent 
                  className="p-0 bg-transparent border-none"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onPointerDownOutside={(e) => e.preventDefault()}
                >
                  <ThemeInfoPopup onClose={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}