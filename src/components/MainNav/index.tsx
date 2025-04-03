
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./components/Logo";
import { NavigationItems } from "./components/NavigationItems";
import { SearchButton } from "./components/SearchButton";
import { AuthSection } from "./components/AuthSection";
import { useAdminAccess } from "@/admin/hooks/useAdminAccess";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteTheme } from "@/components/theme/SiteThemeProvider";
import { useAuth } from "@/auth/hooks/useAuth";
import { useCoreLayouts } from "@/hooks/useCoreLayouts";
import { CoreLayoutRenderer } from "@/components/layout/CoreLayoutRenderer";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

export function MainNav() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { hasAdminAccess } = useAdminAccess();
  const { isAuthenticated } = useAuth();
  const { componentStyles } = useSiteTheme();
  const { topNavLayout, isLoading: layoutsLoading } = useCoreLayouts();
  const logger = useLogger('MainNav', LogCategory.UI);

  // Get MainNav styles from theme with complete fallbacks
  const styles = componentStyles?.MainNav || {
    container: {
      base: 'fixed top-0 w-full z-50 transition-all duration-300',
      animated: 'animate-morph-header shadow-[0_4px_30px_rgba(0,0,0,0.1),inset_0_0_30px_rgba(var(--color-primary),0.1)]'
    },
    header: 'bg-background/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(var(--color-primary),0.2)] border-b border-primary/30',
    dataStream: 'relative overflow-hidden',
    dataStreamEffect: 'mainnav-data-stream',
    glitchParticles: 'mainnav-glitch-particles',
  };

  useEffect(() => {
    logger.debug("MainNav - Component mounted", {
      details: {
        hasAdminAccess,
        isAuthenticated,
        hasThemeStyles: !!componentStyles?.MainNav,
        hasTopNavLayout: !!topNavLayout,
        layoutsLoading
      }
    });
    
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  }, [hasAdminAccess, componentStyles, isAuthenticated, topNavLayout, layoutsLoading, logger]);

  // Render the layout from database if available, otherwise fall back to the hardcoded version
  return (
    <CoreLayoutRenderer
      layout={topNavLayout}
      isLoading={layoutsLoading}
      className="w-full"
      id="main-navigation"
      fallback={
        <div className={cn(
          styles.container.base,
          isLoaded && styles.container.animated,
          "mainnav-container"
        )}>
          <header
            className={cn(
              styles.header,
              "mainnav-header glass-morphism"
            )}
          >
            <div className={cn(
              styles.dataStream, 
              styles.dataStreamEffect,
              "mainnav-effects-wrapper"
            )}>
              <div className={cn(
                styles.glitchParticles,
                "absolute inset-0 w-full h-full pointer-events-none"
              )} />
              
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                  <Logo />
                  <NavigationItems />
                  <div className="flex items-center gap-4">
                    <SearchButton />
                    {isAuthenticated && hasAdminAccess && (
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
            </div>
          </header>
        </div>
      }
    />
  );
}
