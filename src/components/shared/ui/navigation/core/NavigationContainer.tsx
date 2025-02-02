import { useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useNavigationStore } from "../NavigationState";
import { useTheme } from '@/components/theme/ThemeContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface NavigationContainerProps {
  children: React.ReactNode;
}

export const NavigationContainer = ({ children }: NavigationContainerProps) => {
  const { isScrolled, mousePosition, setIsScrolled, setMousePosition } = useNavigationStore();
  const { theme } = useTheme();

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 20;
      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled);
        console.log('Navigation scroll state changed:', shouldBeScrolled);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled, setIsScrolled]);

  // Handle mouse movement for dynamic effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    if (Math.abs(x - mousePosition.x) > 1 || Math.abs(y - mousePosition.y) > 1) {
      setMousePosition({ x, y });
      console.log('Mouse position updated:', { x, y });
    }
  };

  // Error boundary handler
  const handleError = () => {
    toast.error("Navigation error occurred", {
      description: "Please refresh the page if issues persist"
    });
  };

  const neonCyan = theme?.neon_cyan || '#41f0db';
  const neonPink = theme?.neon_pink || '#ff0abe';
  const neonPurple = theme?.neon_purple || '#8000ff';

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: parseFloat(theme?.transition_duration || '0.3') }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] h-[3.7rem]",
        "before:content-[''] before:absolute before:inset-0 before:bg-cyber-texture before:opacity-10",
        "after:content-[''] after:absolute before:inset-0 after:bg-scratch-overlay after:opacity-[0.05]",
        isScrolled && "shadow-lg shadow-black/20 backdrop-blur-xl"
      )}
      onMouseMove={handleMouseMove}
      onError={handleError}
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(77, 0, 179, ${isScrolled ? '0.3' : '0.2'}), 
            rgba(114, 34, 140, ${isScrolled ? '0.3' : '0.2'}), 
            rgba(176, 230, 83, ${isScrolled ? '0.3' : '0.2'})
          ),
          radial-gradient(
            circle at ${mousePosition.x}% ${mousePosition.y}%, 
            ${neonCyan}25,
            ${neonPink}25,
            ${neonPurple}25
          )
        `,
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(12px)',
        borderBottom: `1px solid ${neonPurple}50`,
        transition: `all ${theme?.transition_duration || '0.3s'} ease-in-out`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {children}
        </div>
      </div>

      {/* Dynamic glow effect based on mouse position */}
      <div 
        className="absolute inset-0 pointer-events-none z-[-1]"
        style={{
          background: `radial-gradient(
            circle at ${mousePosition.x}% ${mousePosition.y}%,
            ${neonCyan}15,
            transparent 25%
          )`,
        }}
      />

      {/* Additional cyberpunk accent line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[1px] opacity-50"
        style={{
          background: `linear-gradient(90deg, 
            transparent,
            ${neonCyan},
            ${neonPink},
            ${neonPurple},
            transparent
          )`
        }}
      />
    </motion.nav>
  );
};