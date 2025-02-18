
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./components/Logo";
import { NavigationItems } from "./components/NavigationItems";
import { SearchButton } from "./components/SearchButton";
import { AuthSection } from "./components/AuthSection";

export function MainNav() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  }, []);

  return (
    <header
      className={cn(
        "mainnav-container",
        "mainnav-header",
        "mainnav-gradient",
        "mainnav-morph"
      )}
    >
      <div className="mainnav-effects-wrapper absolute inset-0 w-full h-full overflow-hidden">
        <div className="mainnav-data-stream mainnav-glitch-particles w-full h-full pointer-events-none" />
      </div>
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
