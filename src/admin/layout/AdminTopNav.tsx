
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, User, BellRing } from "lucide-react";
import { useAdminStore } from "../store/admin.store";
import { cn } from "@/lib/utils";

export const AdminTopNav = () => {
  const { scrollY, sidebarExpanded, toggleSidebar } = useAdminStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsScrolled(scrollY > 50);
  }, [scrollY]);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        "flex items-center justify-between h-16",
        "bg-[var(--impulse-bg-overlay)] backdrop-filter backdrop-blur-xl",
        "border-b border-[var(--impulse-border-normal)]",
        isScrolled && "h-14 shadow-md"
      )}
    >
      <div className="flex items-center px-4">
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 flex items-center justify-center hover:bg-[rgba(0,240,255,0.1)] rounded-full mr-4 text-[var(--impulse-text-secondary)]"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <Link to="/admin" className="text-lg font-bold text-[var(--impulse-primary)]">
          MakersImpulse Admin
        </Link>
      </div>

      <div className="flex items-center gap-2 px-4">
        <button className="w-10 h-10 flex items-center justify-center hover:bg-[rgba(0,240,255,0.1)] rounded-full text-[var(--impulse-text-secondary)]">
          <BellRing className="w-5 h-5" />
        </button>
        
        <button className="w-10 h-10 flex items-center justify-center hover:bg-[rgba(0,240,255,0.1)] rounded-full text-[var(--impulse-text-secondary)]">
          <User className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => navigate("/")}
          className="ml-2 text-sm font-medium text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-accent)] px-4 py-2 transition-colors"
        >
          Return to Site
        </button>
      </div>
    </div>
  );
};
