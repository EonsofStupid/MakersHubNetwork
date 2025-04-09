
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Login from "@/pages/Login";
import { useEffect, useState } from "react";
import { useSiteTheme } from "@/components/theme/SiteThemeProvider";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

interface LoginSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginSheet = ({ isOpen, onOpenChange }: LoginSheetProps) => {
  const { variables, componentStyles } = useSiteTheme();
  const logger = useLogger("LoginSheet", LogCategory.AUTH);
  const [isStylesApplied, setIsStylesApplied] = useState(false);
  
  // Get styles for LoginSheet from the theme
  const sheetStyles = componentStyles?.LoginSheet || {
    container: "backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)]",
    transform: "polygon(20px 0, 100% 0, 100% 100%, 0 100%)",
    heading: "text-2xl font-heading text-primary mb-6"
  };

  // Use CSS custom properties for auth UI styling
  useEffect(() => {
    if (isOpen && !isStylesApplied) {
      logger.info("Applying custom styles to auth UI", {
        details: {
          sheetOpen: isOpen,
          effectColor: variables?.effectColor,
          effectSecondary: variables?.effectSecondary 
        }
      });
      
      const authContainer = document.querySelector('.auth-container');
      if (authContainer) {
        const style = document.createElement('style');
        style.id = 'auth-custom-styles';
        
        // Enhanced styling for Google login button
        const googleButtonStyles = `
          .sbui-btn-social.sbui-social-provider-google {
            position: relative;
            background-color: rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(10px);
            border: 1px solid var(--primary) !important;
            color: white !important;
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
            overflow: hidden;
            transition: all 0.3s ease;
          }
          
          .sbui-btn-social.sbui-social-provider-google:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
            border-color: rgba(0, 240, 255, 0.6) !important;
          }
          
          .sbui-btn-social.sbui-social-provider-google::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 200%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(0, 240, 255, 0.2) 50%,
              transparent 100%
            );
            transition: all 0.5s ease;
            z-index: -1;
          }
          
          .sbui-btn-social.sbui-social-provider-google:hover::after {
            left: 100%;
          }
          
          .sbui-btn-social.sbui-social-provider-google img {
            filter: drop-shadow(0 0 4px rgba(0, 240, 255, 0.6));
          }
        `;
        
        // Base styles for auth buttons
        const baseStyles = `
          .auth-button.sbui-btn-primary {
            background-color: var(--primary) !important;
            border: 1px solid var(--primary) !important;
          }
          .auth-button.sbui-btn-primary:hover {
            background-color: var(--primary-foreground) !important;
            color: var(--primary) !important;
          }
          .sbui-btn-social {
            backdrop-filter: blur(8px);
            background-color: rgba(0, 240, 255, 0.1) !important;
            border: 1px solid var(--primary) !important;
            transition: all 0.3s ease;
          }
          .sbui-btn-social:hover {
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
            transform: translateY(-2px);
          }
          .sbui-space-y-4 > .sbui-btn-container {
            position: relative;
            overflow: hidden;
          }
          .sbui-space-y-4 > .sbui-btn-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 200%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(0, 240, 255, 0.2) 50%,
              transparent 100%
            );
            transition: all 0.5s ease;
            z-index: -1;
          }
          .sbui-space-y-4 > .sbui-btn-container:hover::after {
            left: 100%;
          }
        `;
        
        style.innerHTML = baseStyles + googleButtonStyles;
        document.head.appendChild(style);
        setIsStylesApplied(true);
        
        return () => {
          const styleEl = document.getElementById('auth-custom-styles');
          if (styleEl) styleEl.remove();
          setIsStylesApplied(false);
        };
      }
    }
  }, [isOpen, variables, isStylesApplied, logger]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className={`w-[400px] ${sheetStyles.container} transform-gpu cyber-effect-text before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:pointer-events-none`}
        style={{
          clipPath: sheetStyles.transform || "polygon(20px 0, 100% 0, 100% 100%, 0 100%)",
          transform: "translateX(0) skew(-5deg)",
          transformOrigin: "100% 50%",
        }}
      >
        <div className="transform skew-[5deg] origin-top-right">
          <h2 className={cn(sheetStyles.heading, "text-gradient-primary")} style={{
            background: `linear-gradient(to right, ${variables?.effectColor || '#00F0FF'}, ${variables?.effectSecondary || '#FF2D6E'})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Welcome Back</h2>
          <Login onSuccess={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Helper function to combine class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
