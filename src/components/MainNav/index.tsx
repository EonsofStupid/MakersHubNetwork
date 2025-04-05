
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./components/Logo";
import { NavigationItems } from "./components/NavigationItems";
import { SearchButton } from "./components/SearchButton";
import { AuthSection } from "./components/AuthSection";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { Link } from "react-router-dom";
import { Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteTheme } from "@/components/theme/SiteThemeProvider";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

export function MainNav() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { hasAdminAccess } = useAdminAccess();
  const { componentStyles, animations, variables, isLoaded: themeIsLoaded } = useSiteTheme();
  const logger = useLogger("MainNav", LogCategory.UI);
  const dataStreamRef = useRef<HTMLDivElement>(null);
  const glitchParticlesRef = useRef<HTMLDivElement>(null);
  
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

  // Handle scroll position to apply trapezoid shape
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    logger.info("MainNav mounting");
    
    // Apply animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
      
      // Apply dynamic animation styles
      if (dataStreamRef.current) {
        dataStreamRef.current.classList.add('animate-data-stream');
      }
      
      if (glitchParticlesRef.current) {
        glitchParticlesRef.current.classList.add('animate-particles-1');
      }
    }, 100);
    
    // Apply random glitch effects occasionally
    const glitchInterval = setInterval(() => {
      const navElement = document.querySelector('.mainnav-container');
      if (navElement && Math.random() > 0.7) {
        navElement.classList.add('glitch-effect');
        setTimeout(() => {
          navElement.classList.remove('glitch-effect');
        }, 200);
      }
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(glitchInterval);
    };
  }, [logger, variables]);

  return (
    <header
      className={cn(
        "mainnav-container",
        "mainnav-header",
        "mainnav-gradient",
        isLoaded && (styles.container?.animated || "mainnav-morph"),
        isScrolled && "mainnav-scrolled transform-gpu"
      )}
      style={{
        clipPath: isScrolled 
          ? 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' // Trapezoid when scrolled
          : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' // Regular rectangle when at top
      }}
    >
      {/* Enhanced glass effect with dual color overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-xl border-b border-primary/30 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="mainnav-effects-wrapper absolute inset-0 w-full h-full overflow-hidden">
        <div 
          ref={dataStreamRef}
          className={cn(
            "w-full h-full pointer-events-none", 
            styles.dataStream,
            styles.dataStreamEffect || "mainnav-data-stream"
          )} 
        />
        <div 
          ref={glitchParticlesRef}
          className={cn(
            "w-full h-full pointer-events-none",
            styles.glitchParticles || "mainnav-glitch-particles"
          )} 
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
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
            {hasAdminAccess && (
              <Button 
                variant="ghost" 
                size="icon"
                className="text-primary hover:text-white hover:bg-primary/30 relative"
              >
                <Settings className="h-5 w-5 animate-spin-slow" />
                <span className="absolute inset-0 rounded-full border border-primary/50 scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100"></span>
              </Button>
            )}
            <AuthSection />
          </div>
        </div>
      </div>
    </header>
  );
}
