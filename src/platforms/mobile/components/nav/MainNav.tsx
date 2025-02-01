import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./components/Logo";
import { SearchButton } from "./components/SearchButton";
import { AuthSection } from "./components/AuthSection";
import { MobileMenu } from "./components/MobileMenu";

export function MainNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled || isLoaded
          ? "bg-background/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,240,255,0.2)] border-b border-primary/30"
          : "bg-transparent",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:via-secondary/10 before:to-primary/10 before:opacity-0 before:transition-opacity before:duration-300",
        (isScrolled || isLoaded) && [
          "before:opacity-100",
          "animate-morph-header",
          "shadow-[0_4px_30px_rgba(0,0,0,0.1),inset_0_0_30px_rgba(0,240,255,0.1)]",
        ]
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <Logo />
          <div className="flex items-center gap-2">
            <SearchButton />
            <AuthSection />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}