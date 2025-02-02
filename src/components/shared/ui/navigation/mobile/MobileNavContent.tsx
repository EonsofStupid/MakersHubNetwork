import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '@/lib/store/auth-store';
import { Menu, LogOut, User, Home, Book, Wrench, Settings, LayoutDashboard, Database, Zap, Radio, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  to: string;
  label: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
  adminOnly?: boolean;
  color?: string;
}

interface MobileNavContentProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavContent = ({ isOpen, onClose }: MobileNavContentProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  console.log('MobileNavContent: Rendering with user:', user?.email, 'role:', user?.role);

  const handleNavigation = (to: string) => {
    navigate(to);
    onClose();
    toast.success(`Navigating to ${to.split('/').pop()?.toUpperCase() || 'Home'}`);
  };

  const adminMenuItems: MenuItem[] = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-[#41f0db]" },
    { to: "/admin/users", label: "Users", icon: User, color: "text-[#b0e653]" },
    { to: "/admin/data-maestro", label: "Data Maestro", icon: Database, color: "text-[#4d00b3]" },
    { to: "/admin/performance", label: "Performance", icon: Zap, color: "text-[#41f0db]" },
    { to: "/admin/monitoring", label: "Monitoring", icon: Radio, color: "text-[#b0e653]" },
    { to: "/admin/forum", label: "Forum", icon: MessageSquare, color: "text-[#4d00b3]" },
  ];

  const menuItems: MenuItem[] = [
    { to: "/", label: "Home", icon: Home, color: "text-[#41f0db]" },
    { to: "/maker-space", label: "Maker Space", icon: Wrench, requiresAuth: true, color: "text-[#b0e653]" },
    { to: "/blog", label: "Blog", icon: Book, color: "text-[#4d00b3]" },
    { to: "/profile", label: "Profile", icon: User, requiresAuth: true, color: "text-[#41f0db]" },
  ];

  const filteredItems = user?.role === 'admin' ? [...menuItems, ...adminMenuItems] : menuItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    if (item.requiresAuth && !user) return false;
    return true;
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-2"
    >
      {filteredItems.map((item, index) => (
        <motion.button
          key={item.to}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => handleNavigation(item.to)}
          className="flex items-center gap-3 w-full p-3 text-left text-white/80 hover:text-white 
                     rounded-lg transition-all duration-300 group relative overflow-hidden
                     hover:bg-white/5 active:scale-95"
        >
          <span className={`p-2 rounded-lg bg-black/20 backdrop-blur-sm ${item.color}`}>
            <item.icon className="h-5 w-5" />
          </span>
          <span className="relative z-10 font-medium">{item.label}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#41f0db]/5 to-[#8000ff]/5 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#41f0db] to-[#8000ff]"
            initial={{ width: "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      ))}
    </motion.div>
  );
};