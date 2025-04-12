
import React from "react";
import { Button } from "@/shared/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useAtom } from "jotai";
import { isSearchingAtom } from "@/admin/atoms/ui.atoms";

export const SearchButton = () => {
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
  
  const handleSearchClick = () => {
    // Add glitch effect when clicked
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
      searchButton.classList.add('glitch-effect');
      setTimeout(() => {
        searchButton.classList.remove('glitch-effect');
      }, 300);
    }
    
    setIsSearching(true);
    
    // Mock search implementation - would be replaced with actual search functionality
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };
  
  return (
    <Button 
      variant="ghost"
      size="icon"
      className={cn(
        "search-button w-9 h-9 p-2 rounded-full transition-all duration-300",
        "hover:bg-primary/10 hover:text-primary",
        "hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]"
      )}
      onClick={handleSearchClick}
      disabled={isSearching}
    >
      <Search className={cn(
        "h-4 w-4",
        isSearching && "animate-spin"
      )} />
    </Button>
  );
};
