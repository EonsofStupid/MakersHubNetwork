import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { User, Settings, LogOut, LayoutDashboard, Menu } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const UserMenu = () => {
  const { user, roles, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = roles.includes("admin") || roles.includes("super_admin");

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full hover:bg-primary/10 transition-colors"
        >
          <Menu className="h-4 w-4 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[300px] backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5 before:pointer-events-none"
        style={{
          clipPath: "polygon(20px 0, 100% 0, 100% 100%, 0 100%)",
          transform: "translateX(0) skew(-10deg)",
          transformOrigin: "100% 50%",
        }}
      >
        <div className="transform skew-x-[10deg] origin-top-right">
          <div className="space-y-4 pt-6">
            <div className="px-4">
              <h2 className="text-lg font-heading font-bold text-primary">
                {user?.email || "My Account"}
              </h2>
            </div>
            <nav className="space-y-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors rounded-md group"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4 text-primary group-hover:animate-pulse" />
                Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors rounded-md group"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4 text-primary group-hover:animate-pulse" />
                Settings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 transition-colors rounded-md group"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 text-primary group-hover:animate-pulse" />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-red-500/10 text-red-500 transition-colors rounded-md group"
              >
                <LogOut className="h-4 w-4 group-hover:animate-pulse" />
                {isLoading ? "Logging out..." : "Log out"}
              </button>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};