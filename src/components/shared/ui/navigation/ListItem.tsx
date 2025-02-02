import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { href: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          ref={ref as any}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300",
            "hover:bg-white/5 hover:text-[#41f0db] focus:bg-white/5 focus:text-[#41f0db]",
            "group/nav-item relative",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none group-hover/nav-item:text-[#41f0db] transition-colors duration-300">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-white/70 group-hover/nav-item:text-white/90 transition-colors duration-300">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";