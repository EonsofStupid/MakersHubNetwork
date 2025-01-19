import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./auth/UserMenu/";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function MainNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    // Delay the loaded state to ensure initial animation
    setTimeout(() => setIsLoaded(true), 500);

    // Auto-redirect on successful auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoginOpen(false);
        navigate('/');
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-[1.5s] ease-in-out",
        isScrolled || isLoaded
          ? "bg-background/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,240,255,0.2)] border-b border-primary/30 after:absolute after:inset-0 after:bg-gradient-to-b after:from-primary/5 after:to-transparent after:pointer-events-none"
          : "bg-transparent",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:via-secondary/10 before:to-primary/10 before:opacity-0 before:transition-opacity before:duration-1000",
        (isScrolled || isLoaded) && [
          "before:opacity-100",
          "animate-morph-header",
          "shadow-[0_4px_30px_rgba(0,0,0,0.1),inset_0_0_30px_rgba(0,240,255,0.1)]",
          "after:content-[''] after:absolute after:inset-0 after:border-2 after:border-primary/20 after:rounded-b-lg after:transition-all after:duration-1000"
        ]
      )}
      style={{
        transform: isScrolled || isLoaded ? "perspective(1000px) rotateX(1deg)" : "none",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">

          <Link 
            to="/" 
            className="relative text-2xl font-bold transition-all duration-1000 hover:translate-y-[-8px] group"
            onMouseMove={handleMouseMove}
            style={{
              '--x': `${mousePosition.x}px`,
              '--y': `${mousePosition.y}px`,
            } as React.CSSProperties}
          >
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary transition-all duration-1000 group-hover:from-[#FF2D6E] group-hover:to-[#FF2D6E] group-hover:animate-[glitch_0.3s_ease-in-out_infinite]">
              <span className="transition-colors duration-[1000ms] group-hover:text-[#FF2D6E]">M</span>
              <span className="transition-colors duration-[1200ms] group-hover:text-[#FF2D6E]">a</span>
              <span className="transition-colors duration-[1400ms] group-hover:text-[#FF2D6E]">k</span>
              <span className="transition-colors duration-[1600ms] group-hover:text-[#FF2D6E]">e</span>
              <span className="transition-colors duration-[1800ms] group-hover:text-[#FF2D6E]">r</span>
              <span className="transition-colors duration-[2000ms] group-hover:text-[#FF2D6E]"> </span>
              <span className="transition-colors duration-[2200ms] group-hover:text-[#FF2D6E]">N</span>
              <span className="transition-colors duration-[2400ms] group-hover:text-[#FF2D6E]">e</span>
              <span className="transition-colors duration-[2600ms] group-hover:text-[#FF2D6E]">t</span>
              <span className="transition-colors duration-[2800ms] group-hover:text-[#FF2D6E]">w</span>
              <span className="transition-colors duration-[3000ms] group-hover:text-[#FF2D6E]">o</span>
              <span className="transition-colors duration-[3200ms] group-hover:text-[#FF2D6E]">r</span>
              <span className="transition-colors duration-[3400ms] group-hover:text-[#FF2D6E]">k</span>
            </span>
            <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 rounded-full scale-150"></div>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="mad-scientist-hover">Builder</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/builder"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Start Building
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Create your custom 3D printer build with our interactive builder
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/guides"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          Build Guides
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="mad-scientist-hover">Printer Parts</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[600px] md:grid-cols-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/parts/extrusion"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          Aluminum Extrusion
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/parts/sensors"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          ABL Sensors
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/builds" className="mad-scientist-hover group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Completed Builds
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/membership" className="mad-scientist-hover group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Site Membership
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="mad-scientist-hover">
              <Search className="h-5 w-5" />
            </Button>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Sheet open={isLoginOpen} onOpenChange={setIsLoginOpen}>
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
                        },
                      }}
                      theme="dark"
                      providers={[]}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}