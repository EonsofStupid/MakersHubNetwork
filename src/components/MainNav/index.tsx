
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./components/Logo";
import { NavigationItems } from "./components/NavigationItems";
import { SearchButton } from "./components/SearchButton";
import { AuthSection } from "./components/AuthSection";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { Link } from "react-router-dom";
import { Shield, Wrench, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteTheme } from "@/components/theme/SiteThemeProvider";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";
import { isObject, isString } from "@/utils/typeGuards";

export function MainNav() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { hasAdminAccess } = useAdminAccess();
  const { componentStyles, animations, variables, isLoaded: themeIsLoaded } = useSiteTheme();
  const logger = useLogger("MainNav", LogCategory.UI);
  const dataStreamRef = useRef<HTMLDivElement>(null);
  const glitchParticlesRef = useRef<HTMLDivElement>(null);
  
  // Get MainNav styles from theme with proper type checking
  const styles = isObject(componentStyles?.MainNav) ? componentStyles.MainNav : {
    container: {
      base: 'fixed top-0 w-full z-50 transition-all duration-300',
      animated: 'animate-morph-header'
    },
    header: 'bg-background/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,240,255,0.2)] border-b border-primary/30',
    dataStream: 'relative',
    dataStreamEffect: 'mainnav-data-stream',
    glitchParticles: 'mainnav-glitch-particles',
    nav: 'flex items-center gap-1 md:gap-2',
    navItem: 'px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group',
    navItemActive: 'text-primary',
    navItemActiveIndicator: 'absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-center',
    mobileToggle: 'block md:hidden'
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
    logger.info("MainNav mounting", {
      details: {
        stylesLoaded: !!componentStyles?.MainNav,
        themeLoaded: themeIsLoaded
      }
    });
    
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
  }, [logger, variables, componentStyles, themeIsLoaded]);

  // Safely access the animated property with proper type checking
  const containerAnimated = isObject(styles.container) && isString(styles.container.animated) 
    ? styles.container.animated 
    : "animate-morph-header";

  return (
    <header
      className={cn(
        "mainnav-container",
        "mainnav-header",
        "mainnav-gradient",
        "w-full",
        "left-0",
        "right-0",
        "top-0",
        "fixed",
        isLoaded && containerAnimated,
        isScrolled && "mainnav-scrolled transform-gpu"
      )}
      style={{
        clipPath: isScrolled 
          ? 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' // Trapezoid when scrolled
          : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', // Regular rectangle when at top
        width: '100vw',
        left: '0',
        right: '0'
      }}
    >
      {/* Enhanced glass effect with dual color overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-xl border-b border-primary/30 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Background effects container - positioned to cover the entire TopNav */}
      <div className="mainnav-effects-wrapper absolute inset-0 w-full h-full overflow-hidden">
        <div 
          ref={dataStreamRef}
          className={cn(
            "absolute inset-0 w-full h-full pointer-events-none", 
            isString(styles.dataStreamEffect) ? styles.dataStreamEffect : "mainnav-data-stream"
          )} 
        />
        <div 
          ref={glitchParticlesRef}
          className={cn(
            "absolute inset-0 w-full h-full pointer-events-none",
            isString(styles.glitchParticles) ? styles.glitchParticles : "mainnav-glitch-particles"
          )} 
        />
      </div>
      
      {/* Main navigation content - centered with max width but container itself is full width */}
      <div className="w-full mx-auto flex items-center justify-between h-16 px-4 relative z-10">
        <div className="flex items-center justify-between w-full max-w-[2000px] mx-auto">
          <Logo />
          <NavigationItems />
          <div className="flex items-center gap-2">
            <SearchButton />
            
            {/* Admin access button with wrench icon */}
            {hasAdminAccess && (
              <Link to="/admin">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 group text-primary hover:text-white hover:bg-primary/30 border-primary/40 relative overflow-hidden"
                >
                  <Wrench className="h-4 w-4 group-hover:animate-pulse" />
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
