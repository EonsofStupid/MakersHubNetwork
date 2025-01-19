import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./components/Logo";
import { NavigationItems } from "./components/NavigationItems";
import { SearchButton } from "./components/SearchButton";
import { AuthSection } from "./components/AuthSection";

export function MainNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    setTimeout(() => setIsLoaded(true), 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
          <Logo />
          <NavigationItems />
          <div className="flex items-center gap-4">
            <SearchButton />
            <AuthSection />
          </div>
        </div>
      </div>
    </header>
  );
}