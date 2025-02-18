
import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useThemeStore } from "@/app/stores/theme/store";

export const Logo = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [letterStates, setLetterStates] = useState<{ [key: number]: boolean }>({});
  const { themeTokens } = useThemeStore();
  
  const letters = "MakersImpulse".split("");

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const generateRandomDelay = useCallback(() => {
    return Math.random() * 1000;
  }, []);

  const handleMouseEnter = useCallback(() => {
    letters.forEach((_, index) => {
      setTimeout(() => {
        setLetterStates(prev => ({
          ...prev,
          [index]: true
        }));
      }, generateRandomDelay());
    });
  }, [letters, generateRandomDelay]);

  const handleMouseLeave = useCallback(() => {
    setLetterStates({});
  }, []);

  useEffect(() => {
    return () => {
      setLetterStates({});
    };
  }, []);

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
            className={`
              inline-block transition-all
              ${letterStates[index] ? 'text-secondary scale-125' : 'text-primary scale-100'}
            `}
            style={{
              transitionDelay: `${generateRandomDelay()}ms`,
              transitionDuration: '500ms',
              transform: letterStates[index] 
                ? `scale(${1 + Math.random() * 0.5}) rotate(${Math.random() * 10 - 5}deg)`
                : 'scale(1) rotate(0deg)',
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
