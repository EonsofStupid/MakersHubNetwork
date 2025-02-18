
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
        "mainnav-container mainnav-cyber",
        isScrolled || isLoaded && [
          "mainnav-header",
          "mainnav-gradient",
          "mainnav-morph",
          "mainnav-sporadic-border"
        ]
      )}
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
