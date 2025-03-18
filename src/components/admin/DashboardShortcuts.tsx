
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings,
  Zap,
  BarChart,
  PlusCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/stores/admin/store";

const shortcuts = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/admin/overview",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    permission: "admin:access"
  },
  {
    label: "Users",
    icon: <Users className="h-5 w-5" />,
    path: "/admin/users",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    permission: "admin:users:read"
  },
  {
    label: "Content",
    icon: <FileText className="h-5 w-5" />,
    path: "/admin/content",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    permission: "admin:content:read"
  },
  {
    label: "Analytics",
    icon: <BarChart className="h-5 w-5" />,
    path: "/admin/data-maestro",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    permission: "admin:access"
  },
  {
    label: "Add Content",
    icon: <PlusCircle className="h-5 w-5" />,
    path: "/admin/content/new",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    permission: "admin:content:write"
  },
  {
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    path: "/admin/settings",
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
    permission: "admin:settings:read"
  },
];

export const DashboardShortcuts: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAdminStore();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <Card className="border-primary/20 overflow-hidden backdrop-blur-xl bg-background/30">
      <CardContent className="p-4">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {shortcuts.map((shortcut, i) => (
            hasPermission(shortcut.permission) && (
              <motion.div key={i} variants={item}>
                <button
                  onClick={() => handleClick(shortcut.path)}
                  className={cn(
                    "w-full flex flex-col items-center justify-center p-4 rounded-lg",
                    "transition-all hover:scale-105 hover:shadow-md",
                    shortcut.bgColor,
                    "border border-primary/10 hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "rounded-full p-2 mb-2",
                    shortcut.color
                  )}>
                    {shortcut.icon}
                  </div>
                  <span className="text-sm font-medium">{shortcut.label}</span>
                </button>
              </motion.div>
            )
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};
