
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./components/Logo";
import { NavigationItems } from "./components/NavigationItems";
import { SearchButton } from "./components/SearchButton";
import { AuthSection } from "./components/AuthSection";
import { LoginButton } from "@/components/auth/LoginButton";
import { useAuthAtoms } from "@/hooks/useAuthAtoms";
import { useSiteTheme } from "@/components/theme/SiteThemeProvider";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

export function MainNav() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { componentStyles, animations, variables, isLoaded: themeIsLoaded } = useSiteTheme();
  const logger = useLogger("MainNav", LogCategory.UI);
  const dataStreamRef = useRef<HTMLDivElement>(null);
  const glitchParticlesRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthAtoms();
  
  // Get MainNav styles from theme
  const styles = componentStyles?.MainNav || {
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
        "fixed top-0 left-0 right-0 w-full z-50",
        isLoaded && (styles.container?.animated || "animate-morph-header"),
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
      
      {/* Background effects container - positioned to cover the entire TopNav */}
      <div className="mainnav-effects-wrapper absolute inset-0 w-full h-full overflow-hidden">
        <div 
          ref={dataStreamRef}
          className={cn(
            "absolute inset-0 w-full h-full pointer-events-none", 
            styles.dataStreamEffect || "mainnav-data-stream"
          )} 
        />
        <div 
          ref={glitchParticlesRef}
          className={cn(
            "absolute inset-0 w-full h-full pointer-events-none",
            styles.glitchParticles || "mainnav-glitch-particles"
          )} 
        />
      </div>
      
      {/* Main navigation content - now full width with padding */}
      <div className="w-full flex items-center justify-between h-16 px-4 relative z-10">
        <div className="flex items-center justify-between w-full">
          <Logo />
          <NavigationItems />
          <div className="flex items-center gap-2">
            <SearchButton />
            
            {/* Show Auth Section for authenticated users, Login Button otherwise */}
            {isAuthenticated ? <AuthSection /> : <LoginButton />}
          </div>
        </div>
      </div>
    </header>
  );
}
