
import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { useState, useEffect } from "react";
import { Button } from '@/shared/ui/core/button';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/core/dialog';
import { ThemeInfoPopup } from "@/shared/ui/theme/info/ThemeInfoPopup";
import { Terminal } from "lucide-react";
import { useThemeStore } from "@/shared/stores/theme/store";

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
          "footer-animate",
          "footer-transform"
        ]
      )}
    >
      <div className="container mx-auto px-4">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-gradient">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/resources/docs" 
                    className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/resources/guides" 
                    className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/resources/tutorials" 
                    className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                  >
                    Tutorials
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-gradient">Community</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/community/forum" 
                    className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                  >
                    Forum
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/community/discord" 
                    className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                  >
                    Discord
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/community/blog" 
                    className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-gradient">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/company/about" 
                    className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/company/careers" 
                    className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/company/contact" 
                    className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-gradient">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/legal/terms" 
                    className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/legal/privacy" 
                    className="text-muted-foreground hover:text-primary transition-colors mad-scientist-hover"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span>Debug Console</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <div className="bg-black text-green-400 p-4 font-mono text-sm h-[300px] overflow-auto">
                    {/* Debug console content would go here */}
                    <p>System initialized</p>
                    <p>Checking environment...</p>
                    <p>Environment: production</p>
                    <p>Loading modules...</p>
                    <p>All systems operational</p>
                  </div>
                </DialogContent>
              </Dialog>
              
              <ThemeInfoPopup />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
