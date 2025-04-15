
import { useState, useEffect, useRef } from "react";
import { cn } from "@/shared/utils/cn";
import { Logo } from "./components/Logo";
import { NavigationItems } from "./components/NavigationItems";
import { ThemeDataStream } from "./components/ThemeDataStream";
import { Link } from "react-router-dom";

export function MainNav() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dataStreamRef = useRef<HTMLDivElement>(null);
  const glitchParticlesRef = useRef<HTMLDivElement>(null);
  
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
  }, []);

  return (
    <header
      className={cn(
        "mainnav-container",
        "mainnav-header",
        "mainnav-gradient",
        "fixed top-0 left-0 right-0 w-full z-50",
        isLoaded && "animate-morph-header",
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
        <ThemeDataStream />
        <div 
          ref={glitchParticlesRef}
          className="absolute inset-0 w-full h-full pointer-events-none mainnav-glitch-particles"
        />
      </div>
      
      {/* Main navigation content - now full width with padding */}
      <div className="w-full flex items-center justify-between h-16 px-4 relative z-10">
        <div className="flex items-center justify-between w-full">
          <Logo />
          <NavigationItems />
          <div className="flex items-center gap-2">
            <Link to="/auth" className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-md transition-all">
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
