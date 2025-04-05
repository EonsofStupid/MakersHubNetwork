
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./components/Logo";
import { NavigationItems } from "./components/NavigationItems";
import { SearchButton } from "./components/SearchButton";
import { AuthSection } from "./components/AuthSection";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteTheme } from "@/components/theme/SiteThemeProvider";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

export function MainNav() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { hasAdminAccess } = useAdminAccess();
  const { componentStyles, animations } = useSiteTheme();
  const logger = useLogger("MainNav", LogCategory.UI);
  
  // Get MainNav styles from theme
  const styles = componentStyles?.MainNav || {
    container: {
      base: 'fixed top-0 w-full z-50 transition-all duration-300',
      animated: 'mainnav-morph'
    },
    header: 'mainnav-header',
    dataStream: 'relative',
    dataStreamEffect: 'mainnav-data-stream',
    glitchParticles: 'mainnav-glitch-particles',
  };

  useEffect(() => {
    logger.info("MainNav mounting", { 
      details: { 
        hasAdminAccess, 
        componentStyles: Boolean(componentStyles),
        animationsLoaded: Boolean(animations)
      }
    });
    
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  }, [hasAdminAccess, componentStyles, animations, logger]);

  return (
    <header
      className={cn(
        "mainnav-container",
        "mainnav-header",
        "mainnav-gradient",
        styles.container?.animated || "mainnav-morph"
      )}
    >
      <div className="mainnav-effects-wrapper absolute inset-0 w-full h-full overflow-hidden">
        <div className={cn(
          "w-full h-full pointer-events-none", 
          styles.dataStream,
          styles.dataStreamEffect || "mainnav-data-stream",
          styles.glitchParticles || "mainnav-glitch-particles"
        )} />
      </div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Logo />
          <NavigationItems />
          <div className="flex items-center gap-4">
            <SearchButton />
            {hasAdminAccess && (
              <Link to="/admin">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 group text-primary hover:text-white hover:bg-primary/30 border-primary/40 relative overflow-hidden"
                >
                  <Shield className="h-4 w-4 group-hover:animate-pulse" />
                  <span>Admin</span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Button>
              </Link>
            )}
            <AuthSection />
          </div>
        </div>
      </div>
    </header>
  );
}
