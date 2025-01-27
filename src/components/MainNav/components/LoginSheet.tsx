import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";

interface LoginSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginSheet = ({ isOpen, onOpenChange }: LoginSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="mad-scientist-hover">
          Login
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[400px] backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:pointer-events-none"
        style={{
          clipPath: "polygon(20px 0, 100% 0, 100% 100%, 0 100%)",
          transform: "translateX(0) skew(-10deg)",
          transformOrigin: "100% 50%",
        }}
      >
        <div className="transform skew-[10deg] origin-top-right">
          <h2 className="text-2xl font-heading text-primary mb-6">Welcome Back</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#00F0FF',
                    brandAccent: '#FF2D6E',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'transparent',
                    defaultButtonBackgroundHover: 'rgba(0, 240, 255, 0.1)',
                    defaultButtonBorder: '#00F0FF',
                    defaultButtonText: '#00F0FF',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                divider: 'auth-divider',
                anchor: 'auth-anchor text-primary hover:text-primary/80',
              },
              style: {
                button: {
                  padding: '8px 12px',
                  borderRadius: '8px',
                },
              },
            }}
            theme="dark"
            providers={["github", "google"]}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};