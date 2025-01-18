import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./auth/UserMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Login from "@/pages/Login";
import { useState } from "react";

export function MainNav() {
  const { isAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              MakersImpulse
            </span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/docs"
            >
              Documentation
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/components"
            >
              Components
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/themes"
            >
              Themes
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/examples"
            >
              Examples
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <button className="inline-flex items-center rounded-[0.5rem] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64">
              <span className="hidden lg:inline-flex">
                Search documentation...
              </span>
              <span className="inline-flex lg:hidden">Search...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
          <div className="flex items-center gap-2">
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
                  className="w-[400px] backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 95% 15%, 100% 30%, 95% 85%, 100% 100%, 0 100%)",
                    transform: "translateX(0) skew(-5deg)",
                    transformOrigin: "100% 50%",
                  }}
                >
                  <Login onSuccess={() => setIsLoginOpen(false)} />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}