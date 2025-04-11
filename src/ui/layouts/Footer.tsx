
import { Link } from "react-router-dom";
import { Button } from "@/ui/core/button";
import { ThemeToggle } from "@/ui/theme/ThemeToggle";
import { ThemeInfoPopup } from "@/ui/theme/info/ThemeInfoPopup";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Your App. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ThemeInfoPopup />
          <Button asChild variant="ghost" size="sm">
            <Link to="/legal/privacy">Privacy</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/legal/terms">Terms</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
