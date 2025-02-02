import { useState } from "react";
import { NavigationContainer } from "./core/NavigationContainer";
import { NavigationSection } from "./core/NavigationSection";
import { Logo } from "./Logo";
import { NavigationLinks } from "./NavigationLinks";
import { MegaMenu } from "./MegaMenu";
import { SearchButton } from "./SearchButton";
import { SearchDialog } from "./SearchDialog";
import { UserAvatar } from "../avatar/UserAvatar";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./mobile/MobileNav";

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
            className="transform translate-y-2"
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