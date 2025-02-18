
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
        "footer-container",
        isLoaded && [
          "footer-base",
          "footer-gradient",
          "footer-animate"
        ]
      )}
      style={{ 
        transform: isLoaded ? "perspective(1000px) rotateX(1deg)" : "none",
        clipPath: "polygon(0 100%, 100% 100%, 98% 0%, 2% 0%)"
      }}
    >
      <div className="container mx-auto px-4">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/docs" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="/guides" className="text-muted-foreground hover:text-primary transition-colors">Guides</Link></li>
                <li><Link to="/tutorials" className="text-muted-foreground hover:text-primary transition-colors">Tutorials</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><Link to="/forum" className="text-muted-foreground hover:text-primary transition-colors">Forum</Link></li>
                <li><Link to="/discord" className="text-muted-foreground hover:text-primary transition-colors">Discord</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link></li>
                <li><Link to="/licenses" className="text-muted-foreground hover:text-primary transition-colors">Licenses</Link></li>
              </ul>
            </div>
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
                    className="relative group overflow-hidden px-4 py-2 bg-background/20 backdrop-blur-xl border border-primary/30 hover:bg-primary/5 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-primary/30 focus:outline-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 animate-pulse-slow" />
                    <Terminal className="w-4 h-4 mr-2 text-primary group-hover:animate-pulse relative z-10" />
                    <span className="text-sm group-hover:text-primary transition-colors relative z-10">Theme Info</span>
                    <div className="absolute -inset-px bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500" />
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
