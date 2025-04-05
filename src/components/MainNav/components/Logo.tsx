
import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useThemeStore } from "@/stores/theme/store";
import { useSiteTheme } from "@/components/theme/SiteThemeProvider";

export const Logo = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [letterStates, setLetterStates] = useState<{ [key: number]: boolean }>({});
  const [colors, setColors] = useState<string[]>([]);
  const { themeTokens } = useThemeStore();
  const { variables } = useSiteTheme();
  const letters = "MakersImpulse".split("");
  const animationTimeoutRef = useRef<number[]>([]);
  
  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      animationTimeoutRef.current.forEach(clearTimeout);
    };
  }, []);
  
  // Initialize colors from theme when available
  useEffect(() => {
    const themeColors = [
      variables.effectColor || '#00F0FF',
      variables.effectSecondary || '#FF2D6E',
      '#00FF9D',
      '#FFB400',
      '#8B5CF6'
    ];
    
    setColors(themeColors);
  }, [variables]);
  
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
    return Math.random() * 500;
  }, []);

  const generateRandomScale = useCallback(() => {
    return 1 + Math.random() * 0.5;
  }, []);

  const generateRandomRotation = useCallback(() => {
    return Math.random() * 20 - 10;
  }, []);

  const handleMouseEnter = useCallback(() => {
    // Clear any existing timeouts
    animationTimeoutRef.current.forEach(clearTimeout);
    animationTimeoutRef.current = [];
    
    // Create new random animations for each letter
    letters.forEach((_, index) => {
      const timeoutId = window.setTimeout(() => {
        setLetterStates(prev => ({
          ...prev,
          [index]: true
        }));
      }, generateRandomDelay());
      
      animationTimeoutRef.current.push(timeoutId);
    });
  }, [letters, generateRandomDelay]);

  const handleMouseLeave = useCallback(() => {
    // Clear existing timeouts
    animationTimeoutRef.current.forEach(clearTimeout);
    animationTimeoutRef.current = [];
    
    // Reset all letter states with staggered timing
    letters.forEach((_, index) => {
      const timeoutId = window.setTimeout(() => {
        setLetterStates(prev => ({
          ...prev,
          [index]: false
        }));
      }, generateRandomDelay());
      
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
      } as React.CSSProperties}
    >
      <span className="relative z-10 flex items-center space-x-[1px]">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="inline-block transition-all"
            style={{
              color: letterStates[index] ? getRandomColor() : 'currentColor',
              transitionDelay: `${generateRandomDelay()}ms`,
              transitionDuration: '500ms',
              transform: letterStates[index] 
                ? `scale(${generateRandomScale()}) rotate(${generateRandomRotation()}deg)`
                : 'scale(1) rotate(0deg)',
              textShadow: letterStates[index] 
                ? `0 0 8px ${getRandomColor()}`
                : 'none',
            }}
          >
            {letter}
          </span>
        ))}
      </span>
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
