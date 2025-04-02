
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

export function MainNav() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { hasAdminAccess } = useAdminAccess();
  const { isAuthenticated } = useAuth();
  const { componentStyles } = useSiteTheme();
  const { topNavLayout, isLoading: layoutsLoading } = useCoreLayouts();

  // Get MainNav styles from theme
  const styles = componentStyles?.MainNav || {
    container: {
      base: 'fixed top-0 w-full z-50 transition-all duration-300',
      animated: 'mainnav-morph'
    },
    header: 'mainnav-header',
    dataStream: 'relative',
    dataStreamEffect: '',
    glitchParticles: '',
  };

  useEffect(() => {
    console.log("MainNav - hasAdminAccess:", hasAdminAccess);
    console.log("MainNav - isAuthenticated:", isAuthenticated);
    console.log("MainNav - componentStyles:", componentStyles);
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  }, [hasAdminAccess, componentStyles, isAuthenticated]);

  // Render the layout from database if available, otherwise fall back to the hardcoded version
  return (
    <CoreLayoutRenderer
      layout={topNavLayout}
      isLoading={layoutsLoading}
      fallback={
        <header
          className={cn(
            "mainnav-container",
            "mainnav-header",
            "mainnav-gradient",
            "mainnav-morph"
          )}
        >
          <div className="mainnav-effects-wrapper absolute inset-0 w-full h-full overflow-hidden">
            <div className={cn(
              "w-full h-full pointer-events-none", 
              styles.dataStream,
              styles.dataStreamEffect,
              styles.glitchParticles
            )} />
          </div>
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
        </header>
      }
    />
  );
}
