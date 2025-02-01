import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Builder", href: "/builder" },
    { label: "Build Guides", href: "/guides" },
    { label: "Printer Parts", href: "/parts" },
    { label: "Completed Builds", href: "/builds" },
    { label: "Site Membership", href: "/membership" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-1">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80vw] backdrop-blur-xl bg-background/80">
        <nav className="flex flex-col gap-2 pt-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center px-4 py-3 text-lg font-medium transition-colors hover:bg-primary/10 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};