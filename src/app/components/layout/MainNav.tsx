
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/core/button";
import { UserMenu } from "@/auth/components/UserMenu";
import { authBridge } from "@/bridges/AuthBridge";

export function MainNav() {
  const user = authBridge.getUser();
  const isAuthenticated = authBridge.status.isAuthenticated;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-6 md:gap-10">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold">Your App</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/resources/docs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Documentation
          </Link>
          <Link to="/resources/guides" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Guides
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <UserMenu user={user!} />
        ) : (
          <>
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth/register">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
