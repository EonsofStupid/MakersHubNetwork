
import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useThemeStore } from "@/stores/theme/store";
import { useSiteTheme } from "@/components/theme/SiteThemeProvider";

export const Logo = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [letterStates, setLetterStates] = useState<{ [key: number]: {active: boolean, color: string, scale: number, rotation: number} }>({});
  const [isHovered, setIsHovered] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const { themeTokens } = useThemeStore();
  const { variables, isLoaded } = useSiteTheme();
  const letters = "MakersImpulse".split("");
  const animationTimeoutRef = useRef<number[]>([]);
  // Vibrant cyber aqua color that should remain consistent
  const logoColor = "#00F0FF";
  
  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      animationTimeoutRef.current.forEach(clearTimeout);
    };
  }, []);
  
  // Initialize colors from theme when available
  useEffect(() => {
    if (!isLoaded) return;
    
    const themeColors = [
      variables.effectColor || '#00F0FF',
      variables.effectSecondary || '#FF2D6E',
      '#00FF9D',
      '#FFB400',
      '#8B5CF6',
      '#FE5F55',
      '#4ECDC4',
      '#19647E',
      '#F9C80E',
      '#FB4D3D'
    ];
    
    setColors(themeColors);
  }, [variables, isLoaded]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const getRandomColor = useCallback(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, [colors]);

  const generateRandomDelay = useCallback(() => {
    return Math.random() * 300;
  }, []);

  const generateRandomScale = useCallback(() => {
    return 1 + Math.random() * 0.8;
  }, []);

  const generateRandomRotation = useCallback(() => {
    return Math.random() * 30 - 15;
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    // Clear any existing timeouts
    animationTimeoutRef.current.forEach(clearTimeout);
    animationTimeoutRef.current = [];
    
    // Create new random animations for each letter with a gradual cascade effect
    letters.forEach((_, index) => {
      const timeoutId = window.setTimeout(() => {
        setLetterStates(prev => ({
          ...prev,
          [index]: {
            active: true,
            color: getRandomColor(),
            scale: generateRandomScale(),
            rotation: generateRandomRotation()
          }
        }));
      }, generateRandomDelay() + (index * 50)); // Add cascade effect with index * 50
      
      animationTimeoutRef.current.push(timeoutId);
    });
  }, [letters, generateRandomDelay, getRandomColor, generateRandomScale, generateRandomRotation]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    
    // Clear existing timeouts
    animationTimeoutRef.current.forEach(clearTimeout);
    animationTimeoutRef.current = [];
    
    // Reset all letter states with staggered timing
    letters.forEach((_, index) => {
      const timeoutId = window.setTimeout(() => {
        setLetterStates(prev => ({
          ...prev,
          [index]: {
            active: false,
            color: logoColor, // Reset to default logo color
            scale: 1,
            rotation: 0
          }
        }));
      }, generateRandomDelay() + (letters.length - index) * 40); // Reverse cascade for leaving
      
      animationTimeoutRef.current.push(timeoutId);
    });
  }, [letters, generateRandomDelay]);

  return (
    <Link 
      to="/" 
      className="relative text-2xl font-bold transition-all duration-1000 hover:translate-y-[-8px] group"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        '--x': `${mousePosition.x}px`,
        '--y': `${mousePosition.y}px`,
        color: logoColor, // Always start with cyber aqua
        textShadow: `0 0 10px rgba(0, 240, 255, 0.7)`,
      } as React.CSSProperties}
    >
      {/* Glass effect background that appears on hover */}
      <div 
        className={`
          absolute inset-0 
          bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 
          backdrop-blur-md
          border border-primary/20 rounded-lg
          -z-10 opacity-0 group-hover:opacity-80
          transition-all duration-[800ms] scale-110
          group-hover:scale-120 overflow-hidden
        `}
      >
        {/* Animated particles inside glass background */}
        <div className="absolute w-full h-full overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary/20 rounded-full animate-pulse-slow transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-secondary/20 rounded-full animate-float transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-primary/20 rounded-full animate-pulse-slow transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
      
      {/* Letters with individual animations */}
      <span className="relative z-10 flex items-center space-x-[1px]">
        {letters.map((letter, index) => {
          const letterState = letterStates[index] || { active: false, color: logoColor, scale: 1, rotation: 0 };
          return (
            <span
              key={index}
              className="inline-block transition-all relative"
              style={{
                color: letterState.active ? letterState.color : logoColor,
                transitionDelay: `${generateRandomDelay()}ms`,
                transitionDuration: '500ms',
                transform: letterState.active 
                  ? `scale(${letterState.scale}) rotate(${letterState.rotation}deg)`
                  : 'scale(1) rotate(0deg)',
                textShadow: letterState.active 
                  ? `0 0 8px ${letterState.color}`
                  : `0 0 10px rgba(0, 240, 255, 0.7)`,
                zIndex: letterState.active ? 5 : 1,
                animation: !letterState.active && !isHovered ? 'pulse 2s ease-in-out infinite' : 'none'
              }}
            >
              {letter}
              {letterState.active && (
                <span 
                  className="absolute inset-0 animate-pulse-slow"
                  style={{ 
                    background: `radial-gradient(circle at center, ${letterState.color}30 0%, transparent 70%)`,
                    filter: `blur(4px)`,
                    opacity: 0.7
                  }}
                ></span>
              )}
            </span>
          );
        })}
      </span>
      
      {/* Enhanced glow effect on hover */}
      <div 
        className={`
          absolute inset-0 
          bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 
          blur-xl opacity-0 group-hover:opacity-100 
          transition-all duration-[1500ms] rounded-full scale-150
        `}
      />
    </Link>
  );
};
