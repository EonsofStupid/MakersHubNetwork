import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Settings, Users, Database, Radio, MessageSquare, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAdminSidebar } from "./AdminSidebarContext";

export const AdminSidebar = () => {
  const { isExpanded } = useAdminSidebar();
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { id: "schedule", label: "Schedule", icon: Calendar, path: "/content/schedule" },
    { id: "queue", label: "Queue", icon: Clock, path: "/content/queue" },
    { id: "users", label: "Users", icon: Users, path: "/admin/users" },
    { id: "data", label: "Data", icon: Database, path: "/admin/data-maestro" },
    { id: "monitoring", label: "Monitoring", icon: Radio, path: "/admin/monitoring" },
    { id: "forum", label: "Forum", icon: MessageSquare, path: "/admin/forum" },
    { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 transition-all duration-300 pt-[3.7rem]",
        isExpanded ? "w-64" : "w-16"
      )}
      style={{ "--sidebar-width": isExpanded ? "16rem" : "4rem" } as any}
    >
      <div className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => (
          <Link key={item.id} to={item.path}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/5",
                activeItem === item.id && "bg-white/5 text-white"
              )}
              onClick={() => setActiveItem(item.id)}
            >
              <item.icon className="w-5 h-5" />
              {isExpanded && <span>{item.label}</span>}
            </Button>
          </Link>
        ))}
      </div>
    </aside>
  );
};