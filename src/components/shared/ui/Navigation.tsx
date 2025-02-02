import { useState } from "react";
import { NavigationContainer } from "./navigation/core/NavigationContainer";
import { NavigationSection } from "./navigation/core/NavigationSection";
import { Logo } from "./navigation/Logo";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { MegaMenu } from "./navigation/MegaMenu";
import { SearchButton } from "./navigation/SearchButton";
import { SearchDialog } from "./navigation/SearchDialog";
import { UserAvatar } from "./avatar/UserAvatar";
import { UserMenu } from "./navigation/UserMenu";
import { MobileNav } from "./navigation/mobile/MobileNav";

export const Navigation = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <NavigationContainer>
      <NavigationSection>
        <Logo />
      </NavigationSection>

      <NavigationSection className="hidden md:flex space-x-6">
        <NavigationLinks />
        <MegaMenu />
      </NavigationSection>

      <NavigationSection className="space-x-4">
        <SearchButton onClick={() => setSearchOpen(true)} />
  
        <div className="hidden md:block relative z-[60]">
          <UserAvatar
            size="lg"
            className="transform translate-y-2 scale-115"
            onClick={() => setShowUserMenu(!showUserMenu)}
          />
          {showUserMenu && <UserMenu onClose={() => setShowUserMenu(false)} />}
        </div>
  
        <MobileNav />
      </NavigationSection>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </NavigationContainer>
  );
};