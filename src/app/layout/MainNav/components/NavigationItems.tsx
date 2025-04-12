
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { useSiteTheme } from "@/shared/hooks/useSiteTheme";
import { motion } from "framer-motion";

interface NavItem {
  name: string;
  href: string;
}

export const NavigationItems = () => {
  const { pathname } = useLocation();
  const { componentStyles } = useSiteTheme();
  
  const styles = componentStyles?.MainNav || {
    nav: 'flex items-center gap-1 md:gap-2',
    navItem: 'px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group',
    navItemActive: 'text-primary',
    navItemActiveIndicator: 'absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-center'
  };
  
  // Mock nav items - these could come from a configuration or database
  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];
  
  return (
    <nav className={cn("hidden md:flex", styles.nav)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              styles.navItem,
              isActive && styles.navItemActive,
              "group cyber-text relative overflow-hidden"
            )}
          >
            {item.name}
            
            {/* Animated underline indicator */}
            {isActive && (
              <motion.span
                className={cn(styles.navItemActiveIndicator, "bg-primary")}
                layoutId="navigation-underline"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            
            {/* Enhanced cyberpunk hover effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-md" />
            
            {/* Bottom border on hover with glow */}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300 shadow-glow" />
            
            {/* Glitch effect on hover */}
            <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-slow pointer-events-none" />
          </Link>
        );
      })}
    </nav>
  );
};
