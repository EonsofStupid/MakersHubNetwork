import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./auth/UserMenu";
import { LoginButton } from "./auth/LoginButton";

export function MainNav() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center gap-4">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-heading font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent sm:inline-block">
              MakersImpulse
            </span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium text-muted-foreground">
            <a
              className="transition-colors hover:text-primary mad-scientist-hover"
              href="/docs"
            >
              Documentation
            </a>
            <a
              className="transition-colors hover:text-primary mad-scientist-hover"
              href="/components"
            >
              Components
            </a>
            <a
              className="transition-colors hover:text-primary mad-scientist-hover"
              href="/themes"
            >
              Themes
            </a>
            <a
              className="transition-colors hover:text-primary mad-scientist-hover"
              href="/examples"
            >
              Examples
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <button className="inline-flex items-center rounded-[0.5rem] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 border border-border/40 bg-background/50 shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64">
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
            {isAuthenticated ? <UserMenu /> : <LoginButton />}
          </div>
        </div>
      </div>
    </header>
  );
}